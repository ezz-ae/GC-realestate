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
    <Card className="border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">AI Assistant</CardTitle>
          <p className="text-xs text-muted-foreground">
            Ask me anything about projects, leads, or sales strategies.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-gradient shadow-sm">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-border/60 bg-background/70 px-4 py-2">
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
