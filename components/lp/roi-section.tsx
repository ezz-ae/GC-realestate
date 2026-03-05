import { Card, CardContent } from "@/components/ui/card"
import { SectionShell } from "@/components/lp/section-shell"

interface RoiSectionProps {
  data: Record<string, unknown>
}

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

const formatAed = (value: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value)

export function RoiSection({ data }: RoiSectionProps) {
  const title = (typeof data.title === "string" && data.title) || "Investment Returns"
  const subtitle =
    (typeof data.subtitle === "string" && data.subtitle) || "Projected metrics for campaign qualification."

  const expectedRoi = toNumber(data.expectedRoi)
  const rentalYield = toNumber(data.rentalYield)
  const startPriceAed = toNumber(data.startPriceAed)
  const metrics = [
    expectedRoi > 0
      ? { label: "Expected ROI", value: `${expectedRoi.toFixed(1)}%` }
      : null,
    rentalYield > 0
      ? { label: "Rental Yield", value: `${rentalYield.toFixed(1)}%` }
      : null,
    startPriceAed > 0
      ? { label: "Starting Price", value: formatAed(startPriceAed) }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>

  if (!metrics.length) return null

  return (
    <SectionShell id="roi" title={title} subtitle={subtitle}>
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</p>
              <p className="mt-2 font-serif text-3xl font-bold gold-text-gradient">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  )
}
