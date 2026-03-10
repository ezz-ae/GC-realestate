"use client"

import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex w-full gap-4 py-4 px-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="mt-0.5 h-8 w-8 border border-border/50 shadow-sm shrink-0">
          <AvatarImage src="/images/ai-avatar.png" alt="AI" />
          <AvatarFallback className="gold-gradient text-black">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col max-w-[80%] md:max-w-2xl", isUser ? "items-end" : "items-start")}>
        <div 
          className={cn(
            "prose prose-neutral dark:prose-invert max-w-none break-words px-5 py-3 shadow-sm text-sm leading-relaxed",
            isUser 
              ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" 
              : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
          )}
        >
           <div className="whitespace-pre-wrap">
              {content}
            </div>
        </div>
        
        {timestamp && (
          <div className={cn("text-[10px] text-muted-foreground/60 uppercase tracking-widest px-1", isUser && "text-right")}>
            {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>
    </div>
  )
}
