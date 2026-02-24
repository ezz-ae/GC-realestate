"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ 
  onSend, 
  disabled, 
  placeholder = "Ask me anything about Dubai real estate..." 
}: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-background/90 to-background px-4 py-3 shadow-sm transition focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
        <div className="mb-2 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="rounded-full border border-border px-2 py-0.5 uppercase tracking-wide">Live data</span>
          <span>Ask about budget, area, or ROI for precise matches.</span>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[72px] resize-none border-0 bg-transparent p-2 pr-12 text-base focus-visible:ring-0"
          rows={2}
        />
        <div className="flex items-center justify-between px-2 pb-1">
          <span className="text-[11px] text-muted-foreground">
            Press Enter to send, Shift+Enter for a new line.
          </span>
        </div>
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={!input.trim() || disabled}
        className="absolute bottom-3 right-4 h-9 w-9 gold-gradient shadow-sm"
      >
        {disabled ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  )
}
