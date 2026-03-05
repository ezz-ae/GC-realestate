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

  return (
    <SectionShell id="roi" title={title} subtitle={subtitle}>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Expected ROI</p>
            <p className="mt-2 font-serif text-3xl font-bold gold-text-gradient">{expectedRoi.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Rental Yield</p>
            <p className="mt-2 font-serif text-3xl font-bold gold-text-gradient">{rentalYield.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Starting Price</p>
            <p className="mt-2 font-serif text-3xl font-bold gold-text-gradient">
              {startPriceAed ? formatAed(startPriceAed) : "On request"}
            </p>
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  )
}
