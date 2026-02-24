import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import {
  DEFAULT_GEMINI_MODELS,
  getGeminiModel,
  getGeminiModelByName,
  listGeminiModels,
  PUBLIC_SYSTEM_PROMPT,
  buildConversationHistory,
} from "@/lib/gemini"
import {
  getGoldenVisaProjects,
  getLlmContextByArea,
  getProjectsByArea,
  getTopROIProjects,
  projectToProperty,
  searchProjects,
} from "@/lib/entrestate"
import { query } from "@/lib/db"
import { randomUUID } from "node:crypto"

const ensureLeadsTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS gc_leads (
      id text PRIMARY KEY,
      name text,
      phone text,
      email text,
      source text,
      project_slug text,
      assigned_broker_id text,
      created_at timestamptz DEFAULT now()
    )
  `)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS assigned_broker_id text`)
}

const extractContactDetails = (text: string) => {
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  const phoneMatch = text.match(/(\+?\d[\d\s().-]{7,}\d)/)
  const nameMatch =
    text.match(/(?:my name is|i am|i'm|this is)\s+([a-z][a-z\s'.-]{1,40})/i) ||
    text.match(/name\s*[:\-]\s*([a-z][a-z\s'.-]{1,40})/i)

  const email = emailMatch ? emailMatch[0] : null
  const rawPhone = phoneMatch ? phoneMatch[1] : null
  const phone = rawPhone ? rawPhone.replace(/[^\d+]/g, "") : null
  const name = nameMatch ? nameMatch[1].trim() : null

  return { email, phone, name }
}

export async function POST(req: NextRequest) {
  const resultLimit = 3
  try {
    const { message, conversationHistory } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Search for relevant properties based on the query
    let relevantProjects = await searchProjects(message, resultLimit)
    
    // Enhanced search based on common patterns
    const lowerMessage = message.toLowerCase()
    
    // Check for specific criteria
    if (lowerMessage.includes('golden visa') || lowerMessage.includes('goldenvisа')) {
      relevantProjects = await getGoldenVisaProjects(resultLimit)
    } else if (lowerMessage.includes('best roi') || lowerMessage.includes('highest return')) {
      relevantProjects = await getTopROIProjects(resultLimit)
    } else if (lowerMessage.includes('2br') || lowerMessage.includes('2 bedroom')) {
      relevantProjects = await searchProjects("2BR", resultLimit)
    } else if (lowerMessage.includes('marina')) {
      relevantProjects = await getProjectsByArea("Marina", resultLimit)
    } else if (lowerMessage.includes('downtown')) {
      relevantProjects = await getProjectsByArea("Downtown", resultLimit)
    } else if (lowerMessage.includes('palm')) {
      relevantProjects = await getProjectsByArea("Palm", resultLimit)
    }

    // Build context with property data
    let propertyContext = ""
    if (relevantProjects.length > 0) {
      propertyContext = "\n\nSHORTLIST (max 3):\n"
      relevantProjects.slice(0, resultLimit).forEach((project, idx) => {
        const prop = projectToProperty(project)
        propertyContext += `
${idx + 1}. ${prop.title}
   - Location: ${prop.location.area}
   - From: ${prop.currency} ${prop.price.toLocaleString()}
   - Beds: ${prop.specifications.bedrooms}
   - ROI: ${prop.investmentMetrics.roi}%
   - Golden Visa: ${prop.investmentMetrics.goldenVisaEligible ? 'Yes' : 'No'}
`
      })
    }

    const areaContext = relevantProjects[0]?.location?.area
      ? await getLlmContextByArea(relevantProjects[0].location.area, 8)
      : ""

    const hasGeminiKey =
      Boolean(process.env.GEMINI_API_KEY || process.env.Gemini_API_KEY || process.env.google_api_key)

    if (!hasGeminiKey) {
      return NextResponse.json({
        reply:
          "AI is temporarily unavailable, but I can still help. Tell me your budget, preferred area, and unit type, then share your name + phone so I can send the best shortlist.",
        properties: relevantProjects.slice(0, resultLimit).map((project) => projectToProperty(project)),
      })
    }

    // Prepare conversation for Gemini
    const model = getGeminiModel('public')

    const createChat = (modelInstance: ReturnType<typeof getGeminiModel>) =>
      modelInstance.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: PUBLIC_SYSTEM_PROMPT }],
          },
        {
          role: "model",
          parts: [{ text: "I understand. I'm your AI assistant for Gold Century Real Estate, specializing in Dubai property investment. I'll help you find the perfect property and provide expert market insights. How can I assist you today?" }],
        },
        ...buildConversationHistory(conversationHistory || [])
      ],
    })

    const conversationText = [
      ...(conversationHistory || [])
        .filter((entry: any) => entry.role === "user")
        .map((entry: any) => entry.content),
      message,
    ].join("\n")

    const contact = extractContactDetails(conversationText)
    const leadContext = `
\n\nLEAD STATUS:
- Name: ${contact.name || "missing"}
- Phone: ${contact.phone || "missing"}
- Email: ${contact.email || "missing"}
If any detail is missing, ask for it before sharing long lists. Keep responses short.
`

    // Send message with property context
    const contextBlock = areaContext
      ? `\n\nAREA INTELLIGENCE (Data: Entrestate Intelligence)\n${areaContext}`
      : ""
    let aiReply = ""
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
        const result = await chat.sendMessage(message + propertyContext + leadContext + contextBlock)
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
            const result = await chat.sendMessage(message + propertyContext + leadContext + contextBlock)
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

    if (contact.phone || contact.email) {
      await ensureLeadsTable()
      const existing = await query<{ id: string }>(
        `SELECT id FROM gc_leads
         WHERE ($1 <> '' AND phone = $1) OR ($2 <> '' AND email = $2)
         LIMIT 1`,
        [contact.phone || "", contact.email || ""],
      )
      if (!existing.length) {
        const leadName =
          contact.name ||
          (contact.email ? contact.email.split("@")[0].replace(/[._-]+/g, " ") : "") ||
          "Website Lead"
        await query(
          `INSERT INTO gc_leads (id, name, phone, email, source, project_slug)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            randomUUID(),
            leadName,
            contact.phone || "",
            contact.email || null,
            "ai-chat",
            relevantProjects[0]?.slug || null,
          ],
        )
      }
    }

    return NextResponse.json({
      reply: aiReply,
      properties: relevantProjects.slice(0, resultLimit).map((project) => projectToProperty(project))
    })

  } catch (error) {
    console.error("[v0] AI Chat API Error:", error)
    try {
      const fallbackProjects = await searchProjects("Dubai", 5)
      return NextResponse.json({
        reply:
          "AI is temporarily unavailable. Tell me your budget and preferred area, then share your name and phone so I can send a tailored shortlist.",
        properties: fallbackProjects.slice(0, resultLimit).map((project) => projectToProperty(project)),
      })
    } catch (fallbackError) {
      console.error("[v0] AI Chat API Fallback Error:", fallbackError)
      return NextResponse.json(
        { error: "Failed to process message. Please try again." },
        { status: 500 }
      )
    }
  }
}
