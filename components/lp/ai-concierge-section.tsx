import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SectionShell } from "@/components/lp/section-shell"

interface AiConciergeSectionProps {
  data: Record<string, unknown>
  landingSlug: string
  projectSlug: string
}

export function AiConciergeSection({ data, landingSlug, projectSlug }: AiConciergeSectionProps) {
  const title = (typeof data.title === "string" && data.title) || "Ask Gold Century AI"
  const subtitle =
    (typeof data.subtitle === "string" && data.subtitle) ||
    "Let AI qualify the buyer, compare options, and prepare the broker handoff."
  const prompts = Array.isArray(data.prompts)
    ? data.prompts.map((item) => (typeof item === "string" ? item : "")).filter(Boolean)
    : []

  const query = encodeURIComponent(
    prompts[0] || `Tell me about ${projectSlug} and whether it fits an investment buyer.`,
  )

  return (
    <SectionShell id="ai-concierge" title={title} subtitle={subtitle}>
      <Card className="overflow-hidden border-primary/20 bg-[radial-gradient(circle_at_top_left,rgba(191,149,63,0.16),transparent_45%),linear-gradient(135deg,#111827,#0f172a)] text-white">
        <CardContent className="grid gap-6 p-6 md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
              Progressive Qualification
            </div>
            <p className="font-serif text-3xl font-semibold leading-tight">
              AI starts the investment conversation before the broker joins.
            </p>
            <Button asChild className="gold-gradient text-primary-foreground">
              <Link href={`/chat?q=${query}&source=lp&landing=${landingSlug}&project=${projectSlug}`}>
                Open AI Assistant
              </Link>
            </Button>
          </div>
          <div className="grid gap-3">
            {prompts.map((prompt) => (
              <div key={prompt} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90">
                {prompt}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  )
}
