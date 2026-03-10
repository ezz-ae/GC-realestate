"use client"

import { useRef, useState } from "react"
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
  placeholder = "Ask about Dubai real estate...",
}: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    const trimmed = input.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setInput("")
    // Keep mobile keyboard open after send
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.focus()
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter = send; Shift+Enter = newline; skip during IME composition
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  // Auto-resize height as content grows
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit() }}
      className="relative w-full max-w-4xl mx-auto"
    >
      <div className="relative flex items-end rounded-3xl border bg-background px-4 py-3 shadow-lg ring-offset-background transition-shadow hover:shadow-xl focus-within:shadow-xl focus-within:border-primary/20">
        <div className="absolute left-4 top-4 text-muted-foreground pointer-events-none">
          <Sparkles className="h-5 w-5 opacity-50" />
        </div>
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus
          inputMode="text"
          rows={1}
          className="min-h-[52px] max-h-[200px] w-full resize-none border-0 bg-transparent py-2.5 pl-10 pr-14 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          style={{ touchAction: "manipulation" }}
        />
        <div className="absolute right-3 bottom-3">
          {/* 44×44px touch target (WCAG 2.5.5) */}
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || disabled}
            aria-label="Send message"
            className={cn(
              "h-11 w-11 shrink-0 rounded-full transition-all touch-manipulation",
              input.trim()
                ? "bg-primary text-primary-foreground shadow-md active:scale-95"
                : "bg-muted text-muted-foreground",
            )}
          >
            {disabled ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
        AI can make mistakes. Consider checking important information.
      </p>
    </form>
  )
}
