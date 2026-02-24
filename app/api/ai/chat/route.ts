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

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Search for relevant properties based on the query
    let relevantProjects = await searchProjects(message, 5)
    
    // Enhanced search based on common patterns
    const lowerMessage = message.toLowerCase()
    
    // Check for specific criteria
    if (lowerMessage.includes('golden visa') || lowerMessage.includes('goldenvisа')) {
      relevantProjects = await getGoldenVisaProjects(5)
    } else if (lowerMessage.includes('best roi') || lowerMessage.includes('highest return')) {
      relevantProjects = await getTopROIProjects(5)
    } else if (lowerMessage.includes('2br') || lowerMessage.includes('2 bedroom')) {
      relevantProjects = await searchProjects("2BR", 5)
    } else if (lowerMessage.includes('marina')) {
      relevantProjects = await getProjectsByArea("Marina", 5)
    } else if (lowerMessage.includes('downtown')) {
      relevantProjects = await getProjectsByArea("Downtown", 5)
    } else if (lowerMessage.includes('palm')) {
      relevantProjects = await getProjectsByArea("Palm", 5)
    }

    // Build context with property data
    let propertyContext = ""
    if (relevantProjects.length > 0) {
      propertyContext = "\n\nRELEVANT PROPERTIES:\n"
      relevantProjects.slice(0, 5).forEach((project, idx) => {
        const prop = projectToProperty(project)
        const usdPrice = prop.currency === "AED" ? Math.round(prop.price / 3.67) : prop.price
        propertyContext += `
${idx + 1}. ${prop.title}
   - Location: ${prop.location.area}
   - Price: ${prop.currency} ${prop.price.toLocaleString()} (USD ${usdPrice.toLocaleString()})
   - Bedrooms: ${prop.specifications.bedrooms}
   - Size: ${prop.specifications.sizeSqft} sqft (${prop.specifications.sizeSqm} sqm)
   - ROI: ${prop.investmentMetrics.roi}%
   - Rental Yield: ${prop.investmentMetrics.rentalYield}%
   - Golden Visa Eligible: ${prop.investmentMetrics.goldenVisaEligible ? 'Yes' : 'No'}
   - Type: ${prop.type}
   - Payment Plan: ${prop.paymentPlan ? `${prop.paymentPlan.downPayment}% down, ${prop.paymentPlan.duringConstruction}% construction, ${prop.paymentPlan.onHandover}% handover` : 'N/A'}
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
          "AI is temporarily unavailable, but I can still share a few relevant options. Let me know your budget, area, and unit type, and I'll refine the list.",
        properties: relevantProjects.slice(0, 5).map((project) => projectToProperty(project)),
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
        const result = await chat.sendMessage(message + propertyContext + contextBlock)
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
            const result = await chat.sendMessage(message + propertyContext + contextBlock)
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

    return NextResponse.json({
      reply: aiReply,
      properties: relevantProjects.slice(0, 5).map((project) => projectToProperty(project))
    })

  } catch (error) {
    console.error("[v0] AI Chat API Error:", error)
    try {
      const fallbackProjects = await searchProjects("Dubai", 5)
      return NextResponse.json({
        reply:
          "AI is temporarily unavailable. Here are a few projects you can explore while I reconnect. Tell me your budget and preferred area for a tighter match.",
        properties: fallbackProjects.map((project) => projectToProperty(project)),
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
