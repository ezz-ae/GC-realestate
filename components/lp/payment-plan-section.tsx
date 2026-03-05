import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { SectionShell } from "@/components/lp/section-shell"

interface PaymentPlanSectionProps {
  data: Record<string, unknown>
}

const toNumber = (value: unknown, fallback: number) => {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

export function PaymentPlanSection({ data }: PaymentPlanSectionProps) {
  const title = (typeof data.title === "string" && data.title) || "Payment Plan"
  const subtitle =
    (typeof data.subtitle === "string" && data.subtitle) || "Flexible milestone structure aligned to project progress."

  const downPayment = toNumber(data.downPayment, 20)
  const duringConstruction = toNumber(data.duringConstruction, 50)
  const onHandover = toNumber(data.onHandover, 30)
  const postHandover = toNumber(data.postHandover, 0)

  const rows = [
    { label: "Down Payment", value: downPayment },
    { label: "During Construction", value: duringConstruction },
    { label: "On Handover", value: onHandover },
    { label: "Post Handover", value: postHandover },
  ]

  return (
    <SectionShell id="payment-plan" title={title} subtitle={subtitle}>
      <Card>
        <CardContent className="space-y-5 p-6">
          {rows.map((row) => (
            <div key={row.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{row.label}</span>
                <span className="text-muted-foreground">{row.value}%</span>
              </div>
              <Progress value={row.value} />
            </div>
          ))}
        </CardContent>
      </Card>
    </SectionShell>
  )
}
