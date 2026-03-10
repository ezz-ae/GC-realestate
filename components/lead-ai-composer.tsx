"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface LeadAiComposerProps {
  leadId: string
  phone: string
  email?: string | null
}

interface DraftPayload {
  whatsapp: string
  emailSubject: string
  emailBody: string
  nextSteps: string[]
}

export function LeadAiComposer({ leadId, phone, email }: LeadAiComposerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [drafts, setDrafts] = useState<DraftPayload | null>(null)

  const generate = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/leads/ai-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate drafts.")
      }
      setDrafts(data)
    } catch (err: any) {
      setError(err?.message || "Failed to generate drafts.")
    } finally {
      setIsLoading(false)
    }
  }

  const copy = async (value: string) => {
    if (!navigator.clipboard?.writeText) return
    await navigator.clipboard.writeText(value)
  }

  const whatsappHref = drafts
    ? `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(drafts.whatsapp)}`
    : `https://wa.me/${phone.replace(/[^0-9]/g, "")}`

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Follow-Up Assistant</CardTitle>
        <p className="text-xs text-muted-foreground">
          Generate WhatsApp, email, and next-step recommendations for this lead.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button className="gold-gradient" onClick={generate} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate AI Drafts"}
          </Button>
          <Button variant="outline" asChild>
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              Open WhatsApp
            </a>
          </Button>
          {email ? (
            <Button variant="outline" asChild>
              <a href={`mailto:${email}${drafts ? `?subject=${encodeURIComponent(drafts.emailSubject)}&body=${encodeURIComponent(drafts.emailBody)}` : ""}`}>
                Open Email
              </a>
            </Button>
          ) : null}
        </div>

        {error ? <div className="text-sm text-destructive">{error}</div> : null}

        {drafts ? (
          <Tabs defaultValue="whatsapp" className="space-y-4">
            <TabsList>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="steps">Next Steps</TabsTrigger>
            </TabsList>
            <TabsContent value="whatsapp" className="space-y-3">
              <Textarea value={drafts.whatsapp} readOnly className="min-h-[160px]" />
              <Button variant="outline" onClick={() => copy(drafts.whatsapp)}>
                Copy WhatsApp Draft
              </Button>
            </TabsContent>
            <TabsContent value="email" className="space-y-3">
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={drafts.emailSubject}
                readOnly
              />
              <Textarea value={drafts.emailBody} readOnly className="min-h-[220px]" />
              <Button variant="outline" onClick={() => copy(`${drafts.emailSubject}\n\n${drafts.emailBody}`)}>
                Copy Email Draft
              </Button>
            </TabsContent>
            <TabsContent value="steps" className="space-y-3">
              <div className="space-y-2">
                {drafts.nextSteps.map((step) => (
                  <div key={step} className="rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-sm">
                    {step}
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={() => copy(drafts.nextSteps.join("\n"))}>
                Copy Next Steps
              </Button>
            </TabsContent>
          </Tabs>
        ) : null}
      </CardContent>
    </Card>
  )
}
