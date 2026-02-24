import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectCard } from "@/components/project-card"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  getDeveloperBySlug,
  getDevelopers,
  getProjectsByDeveloper,
  getPropertiesByDeveloper,
  getDeveloperStats,
} from "@/lib/entrestate"

export async function generateStaticParams() {
  const developers = await getDevelopers()
  return developers.map((developer) => ({ slug: developer.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const developer = await getDeveloperBySlug(slug)
  if (!developer) {
    return { title: "Developer Not Found" }
  }
  return {
    title: `${developer.name} | Gold Century Real Estate`,
    description: developer.description,
  }
}

export default async function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const developer = await getDeveloperBySlug(slug)

  if (!developer) {
    notFound()
  }

  const developerProjects = await getProjectsByDeveloper(developer.name, 6)
  const developerProperties = await getPropertiesByDeveloper(developer.name, 6)
  const stats = await getDeveloperStats(developer.name)

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(value)

  const foundedYear = developer.foundedYear || stats.firstProjectYear
  const headquarters = developer.headquarters || "Dubai, UAE"
  const officialWebsite = developer.website || "Not listed"
  const unitsDelivered = developer.completedProjects ?? stats.completed

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-background to-muted py-16">
          <div className="container">
            <Badge className="mb-4 gold-gradient" variant="secondary">
              Developer Profile
            </Badge>
            <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {developer.name}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              {developer.description || "Developer profile overview and flagship project activity in Dubai."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="rounded-full border border-border px-3 py-1">
                {developer.tier ? `${developer.tier} developer` : "Dubai developer"}
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                {developerProjects.length} projects
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                {developerProperties.length} listings
              </span>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Founded</div>
                    <div className="mt-2 text-sm font-medium text-foreground">
                      {foundedYear || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Headquarters</div>
                    <div className="mt-2 text-sm font-medium text-foreground">
                      {headquarters}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Official Website</div>
                    <div className="mt-2 text-sm font-medium text-foreground">
                      {officialWebsite}
                    </div>
                  </div>
                </div>

                <h2 className="font-serif text-2xl font-bold">Track Record</h2>
                <p className="text-muted-foreground">
                  {developer.trackRecord || "Consistent delivery across prime Dubai communities and mixed-use districts."}
                </p>

                <div>
                  <h3 className="font-serif text-xl font-semibold mb-3">Awards</h3>
                  <div className="flex flex-wrap gap-2">
                    {(developer.awards?.length ? developer.awards : ["Top Developer"]).map((award) => (
                      <Badge key={award} variant="secondary">
                        {award}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-semibold mb-3">Top 5 Areas of Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.topAreas.length ? (
                      stats.topAreas.map((area) => (
                        <Badge key={area.area} variant="secondary">
                          {area.area} · {area.count}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No area data available yet.</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-semibold mb-3">Top 3 Flagship Projects</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {stats.flagshipProjects.length ? (
                      stats.flagshipProjects.map((project) => (
                        <Card key={project.id}>
                          <CardContent className="p-4">
                            <div className="text-sm font-semibold">{project.name}</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              Score: {project.marketScore ?? "N/A"}
                            </div>
                            <Button className="mt-3 w-full" variant="outline" asChild>
                              <Link href={`/projects/${project.slug}`}>View Project</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No flagship projects yet.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="h-fit">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-serif text-xl font-semibold">Trust Signals</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Units delivered</span>
                        <span className="text-foreground">{unitsDelivered}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>On-time delivery rate</span>
                        <span className="text-foreground">
                          {stats.onTimeDeliveryRate != null ? `${stats.onTimeDeliveryRate}%` : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Avg market score</span>
                        <span className="text-foreground">{stats.avgScore || "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Golden Visa eligible</span>
                        <span className="text-foreground">{stats.goldenVisaCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Price range</span>
                        <span className="text-foreground">
                          {stats.minPrice ? formatPrice(stats.minPrice) : "N/A"} -{" "}
                          {stats.maxPrice ? formatPrice(stats.maxPrice) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-fit">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-serif text-xl font-semibold">Market Intelligence</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect developer performance with Dubai-wide market reports and area insights.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" asChild>
                        <Link href="/market/trends">Market Trends & Reports</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/market/areas">Area Performance Guide</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container">
            <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Listings</div>
                <div className="mt-2 text-lg font-semibold">{stats.listings}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Active</div>
                <div className="mt-2 text-lg font-semibold">{stats.active}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Completed</div>
                <div className="mt-2 text-lg font-semibold">{stats.completed}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Avg Yield</div>
                <div className="mt-2 text-lg font-semibold">{stats.avgYield}%</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Avg Score</div>
                <div className="mt-2 text-lg font-semibold">{stats.avgScore}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">GV Count</div>
                <div className="mt-2 text-lg font-semibold">{stats.goldenVisaCount}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Price Range</div>
                <div className="mt-2 text-lg font-semibold">
                  {stats.minPrice ? formatPrice(stats.minPrice) : "N/A"} -{" "}
                  {stats.maxPrice ? formatPrice(stats.maxPrice) : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Units Delivered</div>
                <div className="mt-2 text-lg font-semibold">{unitsDelivered}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/40">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold">Projects by {developer.name}</h2>
                <p className="text-sm text-muted-foreground">Signature developments and communities</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>

            {developerProjects.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No projects are linked to {developer.name} yet. Explore all projects to find similar launches.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {developerProjects.map((project) => (
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
                <h2 className="font-serif text-2xl font-bold">Available Properties</h2>
                <p className="text-sm text-muted-foreground">Live listings from {developer.name}</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/properties">View All Properties</Link>
              </Button>
            </div>

            {developerProperties.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No active listings yet.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {developerProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
