import { Card, CardContent } from "@/components/ui/card"
import { SectionShell } from "@/components/lp/section-shell"

interface MarketIntelligenceSectionProps {
  data: Record<string, unknown>
}

export function MarketIntelligenceSection({ data }: MarketIntelligenceSectionProps) {
  const title = (typeof data.title === "string" && data.title) || "AI Market Read"
  const subtitle =
    (typeof data.subtitle === "string" && data.subtitle) ||
    "A concise commercial narrative generated from the live listing."
  const summary = (typeof data.summary === "string" && data.summary) || ""
  const bullets = Array.isArray(data.bullets)
    ? data.bullets.map((item) => (typeof item === "string" ? item : "")).filter(Boolean)
    : []

  if (!summary && !bullets.length) return null

  return (
    <SectionShell id="market-intelligence" title={title} subtitle={subtitle} className="bg-[linear-gradient(180deg,rgba(191,149,63,0.08),transparent)]">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-primary/20 bg-background/80">
          <CardContent className="p-6 md:p-8">
            <p className="font-serif text-2xl font-semibold leading-tight">{summary}</p>
          </CardContent>
        </Card>
        <div className="grid gap-3">
          {bullets.map((bullet) => (
            <Card key={bullet} className="border-border/70 bg-card/80">
              <CardContent className="p-4 text-sm font-medium text-foreground">
                {bullet}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
