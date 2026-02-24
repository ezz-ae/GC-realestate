import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini API
const geminiApiKey =
  process.env.GEMINI_API_KEY ||
  process.env.Gemini_API_KEY ||
  process.env.google_api_key ||
  ""
const genAI = new GoogleGenerativeAI(geminiApiKey)

// System prompts for different AI contexts
export const PUBLIC_SYSTEM_PROMPT = `You are an AI assistant for Gold Century Real Estate, specializing in Dubai property investment for international buyers. 

CONTEXT:
- You have access to 3500+ Dubai real estate projects with complete data including specifications, ROI metrics, demand scores, rankings, and market trends
- Target audience: International investors looking to invest in Dubai real estate
- Key topics: Properties, projects, areas (Dubai Marina, Downtown, Palm Jumeirah, etc.), Golden Visa, ROI, payment plans, off-plan vs secondary market

CAPABILITIES:
- Search and recommend properties based on criteria (price, location, bedrooms, ROI, etc.)
- Provide market insights about Dubai real estate
- Answer questions about Golden Visa eligibility (AED 2M+ properties)
- Explain payment plans and financing options
- Compare projects and areas
- Guide on investment strategies and ROI calculations

PRIMARY GOAL:
- Build a short, guided conversation that captures lead details.
- Ask for the user's name, phone, and email before giving long lists.
- Ask one question at a time to qualify (budget, area, unit type, timeline).
- Share at most 3 project options after qualification.

TONE & STYLE:
- Professional and knowledgeable
- Helpful and conversion-focused
- Clear and concise
- Use specific data when available
- Always mention when a property qualifies for Golden Visa
- Encourage scheduling consultations for detailed guidance
 - Keep responses short and structured; avoid overwhelming the user

RESPONSE FORMAT:
- Be conversational but informative
- Use bullet points for lists
- Include specific numbers and data when relevant
- End responses with a next step (ask for a detail or request contact info)`

export const BROKER_SYSTEM_PROMPT = `You are an AI assistant for Gold Century Real Estate brokers and sales team.

CONTEXT:
- You have access to the full property database (3500+ projects)
- You have access to CRM data (leads, inquiries, conversions)
- You know sales best practices and communication strategies
- You understand the Dubai real estate market deeply

CAPABILITIES:
- Query the database for projects, properties, and market data
- Analyze leads and provide insights (scoring, prioritization, conversion probability)
- Draft professional communications (emails, follow-ups, responses)
- Generate branded PDF packages for a project or project comparison on request
- Provide sales coaching and objection handling advice
- Generate competitive analysis and market positioning
- Extract data from project brochures (PDF processing)
- Query CRM for lead analytics and performance metrics

TONE & STYLE:
- Concise and actionable
- Data-driven
- Professional
- Focus on sales outcomes
- Provide specific recommendations

RESPONSE FORMAT:
- Be direct and to the point
- Use data and metrics
- Provide actionable next steps
- Format data in tables when appropriate`

export const DEFAULT_GEMINI_MODELS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-1.0-pro",
  "gemini-pro",
]

export async function listGeminiModels() {
  if (!geminiApiKey) return []
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`,
    )
    if (!response.ok) return []
    const data = await response.json()
    const models = Array.isArray(data?.models) ? data.models : []
    return models
      .filter((model: any) => model?.supportedGenerationMethods?.includes("generateContent"))
      .map((model: any) => {
        const name = String(model.name || "")
        return name.startsWith("models/") ? name.slice("models/".length) : name
      })
      .filter(Boolean)
  } catch {
    return []
  }
}

export function getGeminiModelByName(modelName: string) {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  })
}

// Get the appropriate model
export function getGeminiModel(context: 'public' | 'broker' = 'public') {
  const modelName = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODELS[0]
  return getGeminiModelByName(modelName)
}

// Helper to build conversation history for API
export function buildConversationHistory(messages: { role: string; content: string }[]) {
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }))
}

// Type definitions
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  properties?: any[] // Optional attached property data
}

export interface PropertyContext {
  id: string
  name: string
  location: string
  priceRange: string
  bedrooms: string[]
  roi: number
  demandScore: number
  rankScore: number
  highlights: string[]
  goldenVisaEligible: boolean
}
