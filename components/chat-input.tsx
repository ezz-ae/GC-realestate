"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ 
  onSend, 
  disabled, 
  placeholder = "Ask about Dubai real estate..." 
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
    <form onSubmit={handleSubmit} className="relative w-full max-w-4xl mx-auto">
      <div className="relative flex items-end rounded-3xl border bg-background px-4 py-3 shadow-lg ring-offset-background transition-shadow hover:shadow-xl focus-within:shadow-xl focus-within:border-primary/20">
        <div className="absolute left-4 top-4 text-muted-foreground">
           <Sparkles className="h-5 w-5 opacity-50" />
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus
          className="min-h-[52px] max-h-[200px] w-full resize-none border-0 bg-transparent py-2.5 pl-10 pr-12 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          rows={1}
        />
        <div className="absolute right-3 bottom-3">
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || disabled}
            className={cn(
              "h-9 w-9 shrink-0 rounded-full transition-all", 
              input.trim() ? "bg-primary text-primary-foreground shadow-md hover:scale-105" : "bg-muted text-muted-foreground"
            )}
          >
            {disabled ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
      <div className="mt-2 text-center text-[10px] text-muted-foreground/60">
        AI can make mistakes. Consider checking important information.
      </div>
    </form>
  )
}
