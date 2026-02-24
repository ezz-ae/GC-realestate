"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { SiteHeader } from "@/components/site-header"
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
import { Separator } from "@/components/ui/separator"
import { useAIChat } from "@/hooks/use-ai-chat"
import type { Property } from "@/lib/types/project"
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ChatPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q")
  
  const { messages, sendMessage, isLoading, lastProperties, error } = useAIChat()
  const [resultProperties, setResultProperties] = useState<Property[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSendMessage(initialQuery)
    }
  }, [initialQuery])

  const handleSendMessage = async (content: string) => {
    await sendMessage(content)
  }

  useEffect(() => {
    if (lastProperties?.length) {
      setResultProperties(lastProperties)
    }
  }, [lastProperties])

  const suggestedQuestions = [
    "Show me 2BR apartments in Dubai Marina under AED 2M",
    "What are the best ROI projects right now?",
    "Which properties qualify for Golden Visa?",
    "Compare off-plan vs secondary market",
    "Best areas for families in Dubai",
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <div className="container relative flex-1 py-6">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 right-6 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-10 left-0 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
        </div>
        {/* Back button */}
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <section className="mb-6 rounded-3xl border border-border bg-card/70 p-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl gold-gradient shadow-sm">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold">AI Property Assistant</h1>
                <p className="text-sm text-muted-foreground">
                  Ask, compare, and shortlist Dubai investments in minutes.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                3,655 live projects
              </span>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                Golden Visa ready
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Data: Entrestate Intelligence
              </span>
            </div>
          </div>
        </section>

        <div className="grid gap-6">
          <div className="flex flex-col">
            <Card className="flex flex-1 flex-col overflow-hidden">
              <div className="border-b border-border px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl gold-gradient shadow-sm">
                      <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Gold Century AI</div>
                      <div className="text-xs text-muted-foreground">Investor-ready recommendations in seconds</div>
                    </div>
                  </div>
                  <div className="rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] text-muted-foreground">
                    Online · Live data feed
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-auto whitespace-normal text-left border-border/70 bg-background/70 hover:bg-background"
                      onClick={() => handleSendMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4" style={{ height: "calc(100vh - 360px)" }}>
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-6 rounded-2xl border border-border bg-background/80 px-6 py-5">
                      <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Assistant Ready</div>
                      <div className="mt-2 font-serif text-2xl font-semibold">Where do you want to invest in Dubai?</div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Tell me your budget, preferred area, and unit type. I will bring a shortlist with ROI context.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
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
                    {resultProperties.length > 0 && (
                      <div className="mt-6 rounded-2xl border border-border bg-background/80 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-semibold">AI Shortlist</div>
                            <div className="text-xs text-muted-foreground">
                              Tailored matches based on your criteria
                            </div>
                          </div>
                          {shortlistStats && (
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                              <span className="rounded-full border border-border px-2 py-1">
                                {shortlistStats.topArea}
                              </span>
                              <span className="rounded-full border border-border px-2 py-1">
                                {formatShortPrice(shortlistStats.minPrice)} - {formatShortPrice(shortlistStats.maxPrice)}
                              </span>
                              <span className="rounded-full border border-border px-2 py-1">
                                Avg ROI {shortlistStats.avgRoi.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          <Carousel opts={{ align: "start" }} className="relative">
                            <CarouselContent>
                              {resultProperties.map((property) => (
                                <CarouselItem
                                  key={property.id}
                                  className="basis-[85%] sm:basis-1/2 lg:basis-1/3"
                                >
                                  <PropertyCard property={property} />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-3 top-1/2 -translate-y-1/2" />
                            <CarouselNext className="-right-3 top-1/2 -translate-y-1/2" />
                          </Carousel>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              <Separator />

              {/* Input */}
              <div className="p-4">
                {error && (
                  <div className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <ChatInput onSend={handleSendMessage} disabled={isLoading} />
              </div>
            </Card>
        </div>
      </div>
    </div>
  </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {children}
    </div>
  )
}
