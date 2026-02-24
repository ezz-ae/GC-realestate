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
      <div className="rounded-2xl border border-border bg-background/80 px-3 py-2 shadow-sm">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[64px] resize-none border-0 bg-transparent p-2 pr-12 focus-visible:ring-0"
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
