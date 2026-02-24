import { AreaCard } from "@/components/area-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAreas } from "@/lib/entrestate"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dubai Area Guides & Neighborhood Insights | Gold Century",
  description: "Discover the best places to live and invest in Dubai. Comprehensive guides for Dubai Marina, Downtown, Palm Jumeirah, and more.",
  openGraph: {
    title: "Dubai Area Guides & Neighborhood Insights | Gold Century",
    description: "Discover the best places to live and invest in Dubai.",
    images: ["/logo_blsck.png"],
  },
}

export default async function AreasPage() {
  const areas = await getAreas()
  const topYieldAreas = [...areas].sort((a, b) => b.rentalYield - a.rentalYield).slice(0, 3)
  const bestValueAreas = [...areas].sort((a, b) => a.avgPricePerSqft - b.avgPricePerSqft).slice(0, 3)
  const topScoreAreas = [...areas].sort((a, b) => b.investmentScore - a.investmentScore).slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
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
                Compare Dubai neighborhoods by lifestyle, yield, and investment potential. Surface the few that actually outperform — not just another card grid.
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

        <section className="bg-card py-12 border-b border-border">
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/50 p-5">
                <div className="text-xs font-semibold uppercase text-muted-foreground">Top Yield</div>
                <h3 className="mt-2 font-serif text-2xl font-bold">{topYieldAreas[0]?.name}</h3>
                <p className="text-sm text-muted-foreground">Rental yield leader</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {topYieldAreas.map((area) => (
                    <li key={area.slug} className="flex justify-between">
                      <Link href={`/areas/${area.slug}`} className="hover:underline">{area.name}</Link>
                      <span className="font-semibold text-green-600">{area.rentalYield}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-5">
                <div className="text-xs font-semibold uppercase text-muted-foreground">Best Value</div>
                <h3 className="mt-2 font-serif text-2xl font-bold">{bestValueAreas[0]?.name}</h3>
                <p className="text-sm text-muted-foreground">Lowest price per sqft</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {bestValueAreas.map((area) => (
                    <li key={area.slug} className="flex justify-between">
                      <Link href={`/areas/${area.slug}`} className="hover:underline">{area.name}</Link>
                      <span className="font-semibold">AED {area.avgPricePerSqft.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-5">
                <div className="text-xs font-semibold uppercase text-muted-foreground">Score Leaders</div>
                <h3 className="mt-2 font-serif text-2xl font-bold">{topScoreAreas[0]?.name}</h3>
                <p className="text-sm text-muted-foreground">Balanced demand + returns</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {topScoreAreas.map((area) => (
                    <li key={area.slug} className="flex justify-between">
                      <Link href={`/areas/${area.slug}`} className="hover:underline">{area.name}</Link>
                      <span className="font-semibold gold-text-gradient">{area.investmentScore}/10</span>
                    </li>
                  ))}
                </ul>
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
    </div>
  )
}
