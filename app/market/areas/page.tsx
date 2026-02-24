import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { getAreas } from "@/lib/entrestate"
import { AreasGuideClient } from "@/components/areas-guide-client"

export default async function AreasGuidePage() {
  const areas = await getAreas()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-background to-muted py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 gold-gradient" variant="secondary">
                Area Guide
              </Badge>
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Dubai Areas & Neighborhoods
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Comprehensive guide to Dubai's most sought-after locations. Compare areas, explore lifestyle options, and find your perfect neighborhood.
              </p>
            </div>
          </div>
        </section>
        <AreasGuideClient areas={areas} />
      </main>
      <SiteFooter />
    </div>
  )
}
