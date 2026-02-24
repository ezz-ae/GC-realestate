"use client"

import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex gap-4 py-4", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full border border-border/60 shadow-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-background/80"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className={cn("flex-1", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "inline-block max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
            isUser
              ? "bg-gradient-to-br from-primary to-amber-500 text-primary-foreground"
              : "border border-border/60 bg-background/80 text-foreground"
          )}
        >
          <p className="whitespace-pre-wrap">{content}</p>
          {timestamp && (
            <span className="mt-2 block text-[11px] text-muted-foreground/80">
              {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
