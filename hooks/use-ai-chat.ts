import { useState, useCallback } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  properties?: any[]
  data?: any
}

export function useAIChat(mode: 'public' | 'broker' = 'public') {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastProperties, setLastProperties] = useState<any[]>([])

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
        content: data.reply,
        timestamp: new Date(),
        properties: data.properties,
        data: data.data
      }

      setMessages(prev => [...prev, assistantMessage])
      if (data.properties) {
        setLastProperties(data.properties)
      }
    } catch (err) {
      console.error('[v0] Chat error:', err)
      const message = err instanceof Error ? err.message : 'Failed to send message. Please try again.'
      setError(message)
      const fallbackMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content:
          "I'm having trouble connecting to the AI right now. Tell me your budget, preferred area, and unit type, and I'll still surface the best options.",
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
  }, [])

  return {
    messages,
    isLoading,
    error,
    lastProperties,
    sendMessage,
    clearMessages
  }
}
