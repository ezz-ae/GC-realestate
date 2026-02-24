"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { useAIChat } from "@/hooks/use-ai-chat"
import { Sparkles, FileSpreadsheet, FileText, Pin, Share2 } from "lucide-react"

const suggestions = [
  "Show me all projects in Dubai Marina with 8%+ ROI",
  "Which leads should I follow up with today?",
  "Draft a follow-up email for a lead who viewed 3 properties",
  "Compare Project A vs Project B",
]

export default function DashboardAIAssistantPage() {
  const { messages, sendMessage, isLoading, error } = useAIChat("broker")
  const [history, setHistory] = useState<Array<{ id: string; title?: string | null; pinned: boolean; updated_at: string }>>(
    [],
  )

  const latestAttachment = useMemo(() => {
    const reversed = [...messages].reverse()
    return reversed.find((message) => message.data)?.data
  }, [messages])

  const exportRows = useMemo(() => {
    if (!latestAttachment) return []
    if (latestAttachment.type === "leads") {
      return latestAttachment.data.map((lead: any) => ({
        name: lead.name,
        phone: lead.phone,
        email: lead.email || "",
        source: lead.source || "",
        project: lead.project_slug || "",
      }))
    }
    return latestAttachment.data.map((project: any) => ({
      title: project.title,
      area: project.area,
      roi: project.roi,
      priceFrom: project.priceFrom || 0,
    }))
  }, [latestAttachment])

  const loadHistory = async () => {
    const response = await fetch("/api/ai/history")
    if (!response.ok) return
    const data = await response.json()
    if (Array.isArray(data?.conversations)) {
      setHistory(data.conversations)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    if (messages.length) {
      loadHistory()
    }
  }, [messages.length])

  const togglePin = async (id: string, pinned: boolean) => {
    await fetch("/api/ai/conversations/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, pinned }),
    })
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, pinned } : item)),
    )
  }

  const shareConversation = (title: string) => {
    const text = `Gold Century AI Insight: ${title}`
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
    }
  }

  const downloadFile = (content: string, filename: string, type = "text/plain") => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportCsv = () => {
    if (!exportRows.length) return
    const headers = Object.keys(exportRows[0])
    const lines = [
      headers.join(","),
      ...exportRows.map((row: Record<string, any>) =>
        headers
          .map((key) => `"${String(row[key] ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ]
    downloadFile(lines.join("\n"), "dashboard-export.csv", "text/csv")
  }

  const handleExportSummary = () => {
    if (!latestAttachment) return
    const header =
      latestAttachment.type === "leads" ? "Lead Summary" : "Project Shortlist Summary"
    const lines = exportRows.map((row: Record<string, any>) =>
      Object.values(row)
        .map((value) => String(value ?? ""))
        .join(" · "),
    )
    downloadFile([header, "", ...lines].join("\n"), "dashboard-summary.txt")
  }

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-card to-muted/40 p-8 shadow-sm">
        <Badge className="mb-3 gold-gradient border-none px-3" variant="secondary">
          Gemini Intelligence
        </Badge>
        <h1 className="font-serif text-4xl font-bold tracking-tight">Broker Intelligence Command</h1>
        <p className="text-sm text-muted-foreground max-w-2xl mt-2">
          Execute specialized database queries, analyze high-intent leads, and generate investment deliverables with proprietary Gemini-backed models.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <Card className="rounded-[2rem] border-border shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl gold-gradient shadow-lg shadow-primary/20">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="font-serif text-xl font-bold">Ask Gemini</CardTitle>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-0.5">
                  Investment Guidance & Lead Analysis
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {suggestions.map((text) => (
                <Button
                  key={text}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-[10px] font-bold uppercase tracking-tight h-8 border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/20"
                  onClick={() => sendMessage(text)}
                >
                  {text}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="max-h-[580px] space-y-4 overflow-y-auto rounded-3xl border border-border/40 bg-card/40 p-6 shadow-inner">
              {messages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Start a conversation to see project lists, lead insights, and AI coaching.
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                ))
              )}
              {isLoading && (
                <ChatMessage role="assistant" content="Analyzing the latest data..." />
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
              placeholder="Ask about ROI, leads, follow-ups, or comparisons..."
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest AI Data</CardTitle>
              <p className="text-xs text-muted-foreground">
                Results returned from your most recent request.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {!latestAttachment ? (
                <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                  No attached data yet. Ask for leads, projects, or ROI rankings.
                </div>
              ) : latestAttachment.type === "leads" ? (
                <div className="space-y-2">
                  {latestAttachment.data.map((lead: any) => (
                    <div
                      key={lead.id}
                      className="rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-sm"
                    >
                      <div className="font-semibold">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {lead.phone} · {lead.email || "No email"} · {lead.source || "Unknown"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {latestAttachment.data.map((project: any) => (
                    <div
                      key={project.id}
                      className="rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-sm"
                    >
                      <div className="font-semibold">{project.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {project.area} · ROI {project.roi}% · From AED {project.priceFrom?.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export & Share</CardTitle>
              <p className="text-xs text-muted-foreground">Turn AI answers into deliverables.</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleExportCsv}
                disabled={!exportRows.length}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export latest results to CSV
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleExportSummary}
                disabled={!exportRows.length}
              >
                <FileText className="h-4 w-4" />
                Download shortlist summary
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
              <p className="text-xs text-muted-foreground">Pin and share key AI insights.</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {history.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                  No conversations saved yet.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-sm"
                  >
                    <div>
                      <div className="font-semibold">{item.title || "AI Conversation"}</div>
                      <div className="text-xs text-muted-foreground">
                        Updated {new Date(item.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => togglePin(item.id, !item.pinned)}
                        aria-label="Pin conversation"
                      >
                        <Pin className={`h-4 w-4 ${item.pinned ? "text-primary" : ""}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => shareConversation(item.title || "AI Conversation")}
                        aria-label="Share conversation"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
