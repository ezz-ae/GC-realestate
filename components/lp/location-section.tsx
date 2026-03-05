import { Card, CardContent } from "@/components/ui/card"
import { SectionShell } from "@/components/lp/section-shell"

interface LocationSectionProps {
  data: Record<string, unknown>
}

export function LocationSection({ data }: LocationSectionProps) {
  const title = (typeof data.title === "string" && data.title) || "Location"
  const subtitle =
    (typeof data.subtitle === "string" && data.subtitle) || "Strategic placement for end-users and investors."
  const area = (typeof data.area === "string" && data.area) || "Dubai"
  const district = (typeof data.district === "string" && data.district) || ""
  const mapEmbedUrl = typeof data.mapEmbedUrl === "string" ? data.mapEmbedUrl : ""

  return (
    <SectionShell id="location" title={title} subtitle={subtitle}>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Area</p>
            <p className="font-serif text-3xl font-semibold">{area}</p>
            {district && <p className="text-muted-foreground">District: {district}</p>}
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                title="Location map"
                loading="lazy"
                className="h-[280px] w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                Map preview available after campaign publish.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  )
}
