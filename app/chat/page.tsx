"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAIChat } from "@/hooks/use-ai-chat"
import type { Property } from "@/lib/types/project"
import { ArrowLeft, Sparkles, ShieldCheck, Zap } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ChatPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q")
  
  const { messages, sendMessage, isLoading, lastProperties, error } = useAIChat()
  const [resultProperties, setResultProperties] = useState<Property[]>([])
  const [isMobileView, setIsMobileView] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const formatShortPrice = (value: number) =>
    new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(value)

  const shortlistStats = useMemo(() => {
    if (!resultProperties.length) return null
    const prices = resultProperties.map((property) => property.price).filter((price) => Number.isFinite(price))
    const minPrice = prices.length ? Math.min(...prices) : 0
    const maxPrice = prices.length ? Math.max(...prices) : 0
    const avgRoi =
      resultProperties.reduce((sum, property) => sum + (property.investmentMetrics?.roi || 0), 0) /
      Math.max(resultProperties.length, 1)
    const areaCounts = resultProperties.reduce<Record<string, number>>((acc, property) => {
      const area = property.location?.area || "Dubai"
      acc[area] = (acc[area] || 0) + 1
      return acc
    }, {})
    const topArea = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Dubai"
    return {
      minPrice,
      maxPrice,
      avgRoi: Number.isFinite(avgRoi) ? avgRoi : 0,
      topArea,
    }
  }, [resultProperties])

  useEffect(() => {
    if (typeof window === "undefined") return
    const mediaQuery = window.matchMedia("(max-width: 640px)")
    const update = () => setIsMobileView(mediaQuery.matches)
    update()
    mediaQuery.addEventListener("change", update)
    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSendMessage(initialQuery)
    }
  }, [initialQuery])

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, { isMobile: isMobileView })
  }

  useEffect(() => {
    setResultProperties(lastProperties || [])
  }, [lastProperties])

  const suggestedQuestions = [
    "Show me 2BR apartments in Dubai Marina under AED 2M",
    "What are the best ROI projects right now?",
    "Which properties qualify for Golden Visa?",
    "Compare off-plan vs secondary market",
    "Best areas for families in Dubai",
  ]

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.16))] md:h-[calc(100vh-theme(spacing.16)-theme(spacing.4))] overflow-hidden">
       {/* Header */}
       <header className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center">
                <Button variant="ghost" size="sm" className="mr-4 text-muted-foreground hover:text-foreground rounded-full" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shadow-sm">
                        <Sparkles className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                        <h1 className="text-sm font-semibold leading-none">AI Assistant</h1>
                        <p className="text-xs text-muted-foreground mt-1">Powered by Entrestate Intelligence</p>
                    </div>
                </div>
            </div>
          </div>
       </header>

       {/* Main Chat Area */}
       <div className="flex-1 overflow-hidden relative bg-background/50">
            {/* Background Effects */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-30">
                <div className="absolute -top-[10%] -right-[5%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
            </div>

            <div className="h-full">
              <ScrollArea className="h-full px-4 py-8 md:px-8">
                <div className="mx-auto max-w-4xl space-y-10 pb-8">
                    {messages.length === 0 ? (
                         <div className="flex min-h-[50vh] flex-col items-center justify-center text-center space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 ring-8 ring-primary/5">
                                    <Sparkles className="h-8 w-8 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">How can I help you today?</h2>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    I can help you find properties, analyze market trends, and calculate ROI for your investments in Dubai.
                                </p>
                            </div>
                            
                            <div className="grid gap-2 sm:grid-cols-2 w-full max-w-2xl px-4">
                                {suggestedQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSendMessage(question)}
                                        className="flex items-center gap-3 rounded-xl border bg-background/50 p-4 text-sm text-left transition-all hover:bg-muted/50 hover:border-primary/30 hover:shadow-sm"
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <Zap className="h-4 w-4 text-primary" />
                                        </div>
                                        {question}
                                    </button>
                                ))}
                            </div>
                         </div>
                    ) : (
                        <>
                            {messages.map((message, index) => (
                                <ChatMessage
                                    key={index}
                                    role={message.role}
                                    content={message.content}
                                    timestamp={message.timestamp}
                                />
                            ))}
                            {isLoading && (
                                <ChatMessage
                                    role="assistant"
                                    content="Thinking..."
                                />
                            )}
                            
                            {/* Property Results Carousel */}
                             {resultProperties.length > 0 && (
                                <div className="mt-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
                                    <div className="border-b bg-muted/30 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">Featured Properties</h3>
                                                <p className="text-xs text-muted-foreground">Based on your preferences</p>
                                            </div>
                                            {shortlistStats && (
                                                 <div className="hidden sm:flex gap-2">
                                                    <span className="inline-flex items-center rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                                        {shortlistStats.topArea}
                                                    </span>
                                                    <span className="inline-flex items-center rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                                        ROI: {shortlistStats.avgRoi.toFixed(1)}%
                                                    </span>
                                                 </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-6 bg-muted/10">
                                        <Carousel opts={{ align: "start" }} className="w-full max-w-[90vw] md:max-w-none">
                                            <CarouselContent>
                                                {resultProperties.map((property) => (
                                                    <CarouselItem key={property.id} className="basis-[85%] md:basis-1/2 lg:basis-1/3 pl-4">
                                                        <PropertyCard property={property} />
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="-left-3" />
                                            <CarouselNext className="-right-3" />
                                        </Carousel>
                                    </div>
                                </div>
                             )}
                             <div ref={messagesEndRef} className="h-4" />
                        </>
                    )}
                </div>
              </ScrollArea>
            </div>
       </div>

       {/* Input Area */}
       <div className="flex-none bg-background p-4 md:pb-6">
            <div className="mx-auto max-w-3xl">
                {error && (
                  <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    {error}
                  </div>
                )}
                <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </div>
       </div>
    </div>
  )
}
