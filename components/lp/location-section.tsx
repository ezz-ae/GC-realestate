import { Card, CardContent } from "@/components/ui/card"
import { SectionShell } from "@/components/lp/section-shell"

interface LocationSectionProps {
  data: Record<string, unknown>
}

export function LocationSection({ data }: LocationSectionProps) {
  const title = (typeof data.title === "string" && data.title) || "RIO"
  const subtitle =
    (typeof data.subtitle === "string" && data.subtitle) ||
    "Hardcoded investment benchmarks for campaign qualification."

  return (
    <SectionShell id="rio" title={title} subtitle={subtitle}>
      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Expected RIO</p>
            <p className="mt-2 font-serif text-3xl font-bold gold-text-gradient">8.5%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Rental Yield</p>
            <p className="mt-2 font-serif text-3xl font-bold gold-text-gradient">6.8%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Capital Upside</p>
            <p className="mt-2 font-serif text-3xl font-bold gold-text-gradient">11.5%</p>
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  )
}
