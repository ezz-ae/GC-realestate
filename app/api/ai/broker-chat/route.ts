import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import {
  DEFAULT_GEMINI_MODELS,
  getGeminiModel,
  getGeminiModelByName,
  listGeminiModels,
  BROKER_SYSTEM_PROMPT,
  buildConversationHistory,
} from "@/lib/gemini"
import {
  getRecentLeads,
  getTopROIProjects,
  projectToProperty,
  resolveAccessRole,
  searchProjects,
} from "@/lib/entrestate"
import { getSessionUser, logActivity } from "@/lib/auth"
import { appendConversationMessage, upsertConversationMessage } from "@/lib/ai-conversations"

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { message, conversationHistory, conversationId } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Build context based on broker query type
    let context = ""
    const lowerMessage = message.toLowerCase()

    // Database queries
    if (lowerMessage.includes('project') || lowerMessage.includes('propert')) {
      const previewProjects = await searchProjects("", 3)
      context += `\n\nAVAILABLE PROJECTS:\n`
      previewProjects.forEach(project => {
        const prop = projectToProperty(project)
        context += `- ${project.name} | ${project.location.area} | AED ${prop.price.toLocaleString()} | ROI: ${project.investmentHighlights.expectedROI}%\n`
      })
    }

    if (lowerMessage.includes('pdf') || lowerMessage.includes('brochure')) {
      context += `\n\nPDF GENERATION:\n- You can generate branded project or comparison PDFs on request.\n`
    }

    // CRM queries
    const accessRole = resolveAccessRole(sessionUser.role)
    const brokerId = accessRole === "broker" ? sessionUser.id : undefined

    if (lowerMessage.includes('lead') || lowerMessage.includes('follow up')) {
      const leads = await getRecentLeads(5, accessRole, brokerId)
      if (leads.length) {
        context += `\n\nRECENT LEADS:\n`
        leads.forEach(lead => {
          context += `- ${lead.name} | Phone: ${lead.phone} | Email: ${lead.email || "N/A"} | Source: ${lead.source || "N/A"}\n`
        })
      }
    }

    // Best ROI query
    if (lowerMessage.includes('best roi') || lowerMessage.includes('top perform')) {
      const topProjects = await getTopROIProjects(3)
      context += `\n\nTOP ROI PROJECTS:\n`
      topProjects.forEach(project => {
        context += `- ${project.name} | ROI: ${project.investmentHighlights.expectedROI}% | Yield: ${project.investmentHighlights.rentalYield}%\n`
      })
    }

    let aiReply = ""
    const hasGeminiKey =
      Boolean(process.env.GEMINI_API_KEY || process.env.Gemini_API_KEY || process.env.google_api_key)

    if (!hasGeminiKey) {
      aiReply =
        "AI is temporarily unavailable. I can still pull projects or leads if you tell me what you need."
    } else {
      // Prepare conversation for Gemini
      const model = getGeminiModel('broker')

      const createChat = (modelInstance: ReturnType<typeof getGeminiModel>) =>
        modelInstance.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: BROKER_SYSTEM_PROMPT }],
          },
          {
            role: "model",
            parts: [{ text: "Ready to assist. I can help you query projects, analyze leads, draft communications, and provide sales insights. What do you need?" }],
          },
          ...buildConversationHistory(conversationHistory || [])
        ],
      })

      // Send message with context
      const modelCandidates = [
        process.env.GEMINI_MODEL,
        ...(process.env.GEMINI_MODEL_FALLBACKS?.split(",").map((m) => m.trim()).filter(Boolean) || []),
        ...DEFAULT_GEMINI_MODELS,
      ].filter(Boolean) as string[]

      let lastError: unknown = null
      for (const candidate of modelCandidates) {
        try {
          const candidateModel = candidate === (process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODELS[0])
            ? model
            : getGeminiModelByName(candidate)
          const chat = createChat(candidateModel)
          const result = await chat.sendMessage(message + context)
          const response = await result.response
          aiReply = response.text()
          lastError = null
          break
        } catch (modelError: any) {
          lastError = modelError
          const errorMessage = String(modelError?.message || "")
          if (!errorMessage.includes("not found") && !errorMessage.includes("not supported")) {
            throw modelError
          }
        }
      }

      if (!aiReply) {
        const discoveredModels = await listGeminiModels()
        if (discoveredModels.length) {
          for (const candidate of discoveredModels) {
            try {
              const candidateModel = getGeminiModelByName(candidate)
              const chat = createChat(candidateModel)
              const result = await chat.sendMessage(message + context)
              const response = await result.response
              aiReply = response.text()
              break
            } catch (modelError: any) {
              const errorMessage = String(modelError?.message || "")
              if (!errorMessage.includes("not found") && !errorMessage.includes("not supported")) {
                throw modelError
              }
            }
          }
        }
      }

      if (!aiReply && lastError) {
        throw lastError
      }
    }

    // Extract any data the AI might be referencing
    let attachedData = null
    if (lowerMessage.includes('lead')) {
      const leads = await getRecentLeads(10, accessRole, brokerId)
      attachedData = { type: 'leads', data: leads }
    } else if (lowerMessage.includes('project') || lowerMessage.includes('roi')) {
      const topProjects = await getTopROIProjects(5)
      attachedData = { 
        type: 'projects', 
        data: topProjects.map(project => ({
          id: project.id,
          title: project.name,
          area: project.location.area,
          priceFrom: project.units?.[0]?.priceFrom ?? 0,
          roi: project.investmentHighlights.expectedROI
        }))
      }
    }

    let conversation = null
    const now = new Date().toISOString()
    const userMessageRecord = { role: "user", content: message, timestamp: now }
    const assistantMessageRecord = { role: "assistant", content: aiReply, timestamp: now }

    if (conversationId) {
      conversation = await appendConversationMessage(conversationId, userMessageRecord)
    }
    if (!conversation) {
      conversation = await upsertConversationMessage(sessionUser.id, userMessageRecord)
    }
    if (conversation) {
      conversation = await appendConversationMessage(conversation.id, assistantMessageRecord)
    }

    await logActivity("ai_broker_chat", sessionUser.id, {
      conversationId: conversation?.id,
    })

    return NextResponse.json({
      reply: aiReply,
      data: attachedData,
      conversationId: conversation?.id || null,
    })

  } catch (error) {
    console.error("[v0] Broker AI Chat API Error:", error)
    return NextResponse.json(
      { error: "Failed to process message. Please try again." },
      { status: 500 }
    )
  }
}
