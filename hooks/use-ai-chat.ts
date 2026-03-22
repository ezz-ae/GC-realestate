import { useState, useCallback } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  properties?: any[]
  dataCards?: any[]
  data?: any
  requestId?: string
  provenance?: {
    run_id: string
    snapshot_ts: string
  }
}

export function useAIChat(mode: 'public' | 'broker' = 'public') {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastProperties, setLastProperties] = useState<any[]>([])
  const [lastProvenance, setLastProvenance] = useState<any>(null)
  const [lastRequestId, setLastRequestId] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)
    setLastProperties([])

    try {
      const endpoint = mode === 'public' ? '/api/ai/chat' : '/api/ai/broker-chat'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to get response')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data.reply,
        timestamp: new Date(),
        dataCards: data.dataCards || data.properties,
        data: data.data,
        requestId: data.requestId,
        provenance: data.provenance
      }

      setMessages(prev => [...prev, assistantMessage])
      const properties = data.dataCards || data.properties
      if (properties) {
        setLastProperties(properties)
      }
      if (data.provenance) setLastProvenance(data.provenance)
      if (data.requestId) setLastRequestId(data.requestId)
    } catch (err) {
      console.error('[v0] Chat error:', err)
      const message = err instanceof Error ? err.message : 'Failed to send message. Please try again.'
      setError(message)
      const fallbackMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content:
          "I'm having trouble connecting to the AI right now. Tell me your budget, preferred area, and unit type, then share your name + phone so I can send a tailored shortlist.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages, mode])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
    setLastProperties([])
    setLastProvenance(null)
    setLastRequestId(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    lastProperties,
    lastProvenance,
    lastRequestId,
    sendMessage,
    clearMessages
  }
}
