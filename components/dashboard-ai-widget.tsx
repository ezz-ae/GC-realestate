"use client"

import { useAIChat } from "@/hooks/use-ai-chat"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function DashboardAIWidget() {
  const { messages, sendMessage, isLoading, error } = useAIChat("broker")
  const recentMessages = messages.slice(-4)

  return (
    <Card className="rounded-[2rem] border-primary/20 bg-primary/5 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="font-serif text-2xl font-bold text-primary">Broker AI</CardTitle>
          <p className="text-[10px] uppercase font-bold tracking-widest text-primary/60">
            Intelligent Sales Copilot
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl gold-gradient shadow-lg shadow-primary/20">
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="max-h-[320px] space-y-4 overflow-y-auto rounded-[1.5rem] border border-primary/10 bg-card/60 px-5 py-4 shadow-inner">
          {recentMessages.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Start a conversation to get instant sales insights.
            </div>
          ) : (
            recentMessages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))
          )}
        </div>
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}
        <ChatInput
          onSend={sendMessage}
          disabled={isLoading}
          placeholder="Ask about ROI, lead follow-ups, or project insights..."
        />
      </CardContent>
    </Card>
  )
}
