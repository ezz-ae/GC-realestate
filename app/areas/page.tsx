import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AreaCard } from "@/components/area-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAreas } from "@/lib/entrestate"
import Link from "next/link"

export default async function AreasPage() {
  const areas = await getAreas()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-background to-muted py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 gold-gradient" variant="secondary">
                Areas
              </Badge>
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Dubai Areas & Neighborhoods
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Compare Dubai neighborhoods by lifestyle, yield, and investment potential.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button className="gold-gradient" asChild>
                  <Link href="/contact">Get Area Guidance</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/properties">Browse Properties</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {areas.map((area) => (
                <AreaCard key={area.id} area={area} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
