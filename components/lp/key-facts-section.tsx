import { Card, CardContent } from "@/components/ui/card"
import { SectionShell } from "@/components/lp/section-shell"

interface KeyFactsSectionProps {
  data: Record<string, unknown>
}

export function KeyFactsSection({ data }: KeyFactsSectionProps) {
  const title = (typeof data.title === "string" && data.title) || "Key Facts"
  const subtitle =
    (typeof data.subtitle === "string" && data.subtitle) || "Quick campaign fundamentals for decision making."
  const items = Array.isArray(data.items)
    ? data.items
        .map((item) => (item && typeof item === "object" ? (item as Record<string, unknown>) : null))
        .filter(Boolean)
    : []

  return (
    <SectionShell id="key-facts" title={title} subtitle={subtitle}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => {
          const label = typeof item?.label === "string" ? item.label : "Fact"
          const value = typeof item?.value === "string" ? item.value : "-"
          return (
            <Card key={`${label}-${idx}`}>
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-2 font-serif text-2xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </SectionShell>
  )
}
