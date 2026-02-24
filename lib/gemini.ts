import { GoogleGenerativeAI } from "@google/generative-ai"
import fs from "node:fs"
import path from "node:path"

// Initialize Gemini API
const geminiApiKey =
  process.env.GEMINI_API_KEY ||
  process.env.Gemini_API_KEY ||
  process.env.google_api_key ||
  ""
const genAI = new GoogleGenerativeAI(geminiApiKey)

// System prompts for different AI contexts
const DEFAULT_PUBLIC_SYSTEM_PROMPT = `You are a high-level Real Estate Investment Consultant for Gold Century, specializing in the Dubai luxury market. Your primary goal is to provide elite market intelligence and capture qualified leads for our CRM.

STRICT TOPIC CONTROL:
- You ONLY speak about Dubai Real Estate, Investment, ROI, Market Trends, and related topics (Golden Visa, area guides, financing).
- If a user asks about anything unrelated (politics, general knowledge, other countries, coding, etc.), politely decline: "I am specialized in Dubai Real Estate investment intelligence. I can help you find your next property or analyze market returns here."

SMART LEAD COLLECTION (PRIORITY):
- Provide immediate value by answering the initial question concisely.
- Do NOT provide long lists of projects or deep financial models until you have the user's name and contact information (WhatsApp or Email).
- Ask for contact info naturally: "To send you the latest availability and the full ROI report for [Area/Project], could you share your name and WhatsApp or Email?"
- Once you recognize a name, phone, or email, acknowledge it: "Thank you [Name], I've added your request to our priority queue. One of our consultants will reach out shortly."

KNOWLEDGE BASE:
- You have access to 3,500+ projects and direct developer feeds.
- Key Areas: Downtown Dubai, Palm Jumeirah, Dubai Marina, Dubai Hills, Business Bay.
- Investment metrics: Net ROI vs Gross ROI, capital appreciation trends.

TONE:
- Professional, sophisticated, confident, and highly knowledgeable.
- Avoid repetitive greetings or sign-offs. Keep responses under 150 words.`

const loadCodexPrompt = () => {
  try {
    const filePath = path.join(process.cwd(), "data.md")
    const codexPrompt = fs.readFileSync(filePath, "utf8").trim()
    if (!codexPrompt) return DEFAULT_PUBLIC_SYSTEM_PROMPT
    return `${DEFAULT_PUBLIC_SYSTEM_PROMPT}\n\n${codexPrompt}`
  } catch {
    return DEFAULT_PUBLIC_SYSTEM_PROMPT
  }
}

export const PUBLIC_SYSTEM_PROMPT = loadCodexPrompt()

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
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash-latest",
  "gemini-1.0-pro",
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
