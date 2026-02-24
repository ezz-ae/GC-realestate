import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, ShieldCheck } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAreaBySlug, getAreas, getProjectsByArea, getPropertiesByArea } from "@/lib/entrestate"

export async function generateStaticParams() {
  const areas = await getAreas()
  return areas.map((area) => ({ slug: area.slug }))
}

export default async function AreaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const slug = typeof resolvedParams?.slug === "string" ? resolvedParams.slug.trim() : ""

  if (!slug) {
    notFound()
  }

  const area = await getAreaBySlug(slug)

  if (!area) {
    notFound()
  }

  const areaProjects = await getProjectsByArea(area.name, 6)
  const areaProperties = await getPropertiesByArea(area.name, 6)

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="relative h-[55vh] min-h-[420px]">
          <Image src={area.image} alt={area.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </section>

        <section className="border-b border-border bg-card py-8">
          <div className="container">
            <div className="mb-6 space-y-2">
              <Badge className="gold-gradient" variant="secondary">
                Dubai Area Guide
              </Badge>
              <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl">
                {area.name}
              </h1>
            </div>
            <div className="grid gap-6 md:grid-cols-[1.5fr,1fr] items-center">
              <div className="space-y-4">
                <h2 className="font-serif text-3xl font-bold">About {area.name}</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {area.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {area.lifestyleTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-muted text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-muted/50 p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold gold-text-gradient">AED {area.avgPricePerSqft}</div>
                  <div className="text-xs text-muted-foreground">Avg. Price/sqft</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{area.rentalYield}%</div>
                  <div className="text-xs text-muted-foreground">Rental Yield</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gold-text-gradient">{area.investmentScore}/10</div>
                  <div className="text-xs text-muted-foreground">Investment Score</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/40 border-b border-border">
          <div className="container">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Liquidity</div>
                  <div className="text-xl font-semibold">{area.propertyCount}+ listings</div>
                  <p className="text-sm text-muted-foreground">
                    Depth of available inventory signals easier entry and exit.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Yield Signal</div>
                  <div className="text-xl font-semibold text-green-600">{area.rentalYield}%</div>
                  <p className="text-sm text-muted-foreground">
                    Income-led returns with rental demand anchored by nearby landmarks.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Ownership</div>
                  <div className="text-xl font-semibold">{area.freehold ? "Freehold" : "Leasehold"}</div>
                  <p className="text-sm text-muted-foreground">
                    Suitable for international buyers seeking title security.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-10">
                <div>
                  <h2 className="font-serif text-2xl font-bold">Why Invest in {area.name}</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {area.investmentReasons.map((reason) => (
                      <div key={reason} className="flex items-start gap-2 rounded-lg border border-border bg-card p-4">
                        <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                        <span className="text-sm">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-semibold">Key Landmarks</h3>
                  <div className="mt-4 space-y-3">
                    {area.landmarks.map((landmark) => (
                      <div
                        key={landmark.name}
                        className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium">{landmark.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{landmark.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="h-fit">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-serif text-xl font-semibold">Area Snapshot</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Freehold</span>
                        <span className="font-medium">{area.freehold ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Lifestyle</span>
                        <span className="font-medium">{area.lifestyleTags.join(", ")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Active Listings</span>
                        <span className="font-medium">{area.propertyCount}+</span>
                      </div>
                    </div>
                    <Button className="w-full gold-gradient" asChild>
                      <Link href="/contact">Request Area Consultation</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="h-fit">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-serif text-xl font-semibold">Market Intelligence</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect {area.name} insights with Dubai-wide market reports and trends.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" asChild>
                        <Link href="/market/areas">Compare Dubai Areas</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/market/trends">Market Trends & Reports</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/40">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold">Projects in {area.name}</h2>
                <p className="text-sm text-muted-foreground">Select developments available in this area</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>

            {areaProjects.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No projects are linked to {area.name} yet. Browse all projects to discover nearby launches.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {areaProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold">Properties in {area.name}</h2>
                <p className="text-sm text-muted-foreground">Live listings and investment opportunities</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/properties">View All Properties</Link>
              </Button>
            </div>

            {areaProperties.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No active properties listed yet.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {areaProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container text-center">
            <h2 className="font-serif text-3xl font-bold">Need Guidance on {area.name}?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Speak with our team for tailored investment recommendations.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button className="gold-gradient" asChild>
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/chat">Ask the AI Assistant</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
