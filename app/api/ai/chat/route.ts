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
  // Enhanced email regex
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  
  // Robust international phone number regex
  const phoneMatch = text.match(/(?:\+?\d{1,4}[-.\s]?)?\(?\d{1,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/)
  
  // Smarter name detection (looks for patterns like "I am X", "Name is X", "This is X")
  const namePatterns = [
    /(?:my name is|i am|i'm|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /name\s*[:\-]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
  ]
  
  let name = null
  for (const pattern of namePatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      name = match[1].trim()
      break
    }
  }

  const email = emailMatch ? emailMatch[0].toLowerCase() : null
  const rawPhone = phoneMatch ? phoneMatch[0] : null
  const phone = rawPhone ? rawPhone.replace(/[^\d+]/g, "") : null

  return { email, phone, name }
}

const hasPropertyIntent = (message: string) => {
  const text = message.toLowerCase()
  const propertyKeywords = [
    "show",
    "find",
    "search",
    "list",
    "browse",
    "recommend",
    "suggest",
    "available",
    "looking for",
    "where to buy",
    "best for",
  ]
  const propertyNouns = [
    "property",
    "properties",
    "project",
    "projects",
    "apartment",
    "apartments",
    "villa",
    "villas",
    "unit",
    "units",
    "studio",
    "penthouse",
    "townhouse",
  ]
  
  const hasKeyword = propertyKeywords.some(kw => text.includes(kw))
  const hasNoun = propertyNouns.some(noun => text.includes(noun))
  const hasBeds = /\b[1-6]\s*(br|bed(room)?s?)\b/.test(text)
  const hasPrice = /\b(aed|price|budget|million|k)\b/.test(text)
  
  // Stricter intent: must have a noun AND (a keyword OR price OR beds)
  return hasNoun && (hasKeyword || hasPrice || hasBeds)
}

const buildFallbackReply = (projects: Awaited<ReturnType<typeof searchProjects>>, wantsProperties: boolean) => {
  if (!wantsProperties) {
    return "I can help with Dubai property search, ROI, Golden Visa eligibility, and area comparison. Share your budget, preferred area, and unit type to get a precise shortlist."
  }

  if (!projects.length) {
    return "I couldn't find an exact match right now. Share your budget range, preferred area, and bedroom count, and I'll refine your shortlist instantly."
  }

  const lines = projects.slice(0, 3).map((project) => {
    const property = projectToProperty(project)
    const priceText = property.price
      ? `AED ${property.price.toLocaleString("en-AE")}`
      : "price on request"
    const roiText = Number.isFinite(project.investmentHighlights?.expectedROI)
      ? `${project.investmentHighlights.expectedROI}% ROI`
      : "investment-ready"
    return `- ${property.title} (${property.location.area}) from ${priceText} • ${roiText}`
  })

  return `Here are strong matches right now:\n${lines.join("\n")}\n\nIf you share your name and WhatsApp/email, I can send live availability and a full ROI breakdown.`
}

export async function POST(req: NextRequest) {
  const resultLimit = 3
  let wantsProperties = false
  try {
    const { message, conversationHistory, isMobile } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    wantsProperties = hasPropertyIntent(message) && !Boolean(isMobile)

    // Search for relevant properties based on the query
    let relevantProjects = wantsProperties ? await searchProjects(message, resultLimit) : []
    
    // Enhanced search based on common patterns
    const lowerMessage = message.toLowerCase()
    
    // Check for specific criteria
    if (wantsProperties) {
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
    }

    // Build context with property data (Silent context, not text shortlist)
    let propertyContext = ""
    if (wantsProperties && relevantProjects.length > 0) {
      propertyContext = "\n\n[SYSTEM: User is interested in properties. I have attached 3 relevant project objects to this session. Provide a concise response and guide them to the featured cards below.]\n"
    }

    const areaContext = wantsProperties && relevantProjects[0]?.location?.area
      ? await getLlmContextByArea(relevantProjects[0].location.area, 8)
      : ""

    const hasGeminiKey =
      Boolean(process.env.GEMINI_API_KEY || process.env.Gemini_API_KEY || process.env.google_api_key)

    if (!hasGeminiKey) {
      return NextResponse.json({
        reply: buildFallbackReply(relevantProjects, wantsProperties),
        properties: wantsProperties
          ? relevantProjects.slice(0, resultLimit).map((project) => projectToProperty(project))
          : [],
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

    // STRICT TOPIC VALIDATION
    const topicCheck = message.toLowerCase()
    const isRealEstateRelated = 
      topicCheck.includes('dubai') || 
      topicCheck.includes('real estate') || 
      topicCheck.includes('property') || 
      topicCheck.includes('investment') || 
      topicCheck.includes('roi') || 
      topicCheck.includes('yield') || 
      topicCheck.includes('visa') || 
      topicCheck.includes('project') || 
      topicCheck.includes('apartment') || 
      topicCheck.includes('villa') || 
      topicCheck.includes('marina') || 
      topicCheck.includes('downtown') || 
      topicCheck.includes('budget') ||
      topicCheck.includes('price') ||
      topicCheck.includes('buy') ||
      topicCheck.includes('sell')

    if (!isRealEstateRelated && message.length > 20) {
      // Small messages like "hello" pass, but long unrelated ones get blocked
      return NextResponse.json({
        reply: "I am a specialized Dubai Real Estate Investment Consultant. I can help you with property searches, ROI analysis, and market trends in Dubai. How can I assist your investment journey today?",
        properties: []
      })
    }

    const contact = extractContactDetails(conversationText)
    const leadContext = `
\n\nLEAD STATUS:
- Name: ${contact.name || "missing"}
- Phone: ${contact.phone || "missing"}
- Email: ${contact.email || "missing"}
IMPORTANT: If contact details are missing, prioritize asking for them naturally before providing deep analysis or long lists.
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
      properties: wantsProperties
        ? relevantProjects.slice(0, resultLimit).map((project) => projectToProperty(project))
        : [],
    })

  } catch (error) {
    console.error("[v0] AI Chat API Error:", error)
    try {
      const fallbackProjects = wantsProperties ? await searchProjects("Dubai", 5) : []
      return NextResponse.json({
        reply: buildFallbackReply(fallbackProjects, wantsProperties),
        properties: wantsProperties
          ? fallbackProjects.slice(0, resultLimit).map((project) => projectToProperty(project))
          : [],
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
