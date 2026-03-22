import Link from "next/link"
import { notFound } from "next/navigation"
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
import { safeNum, safePercent, safePrice, shouldShow } from "@/lib/utils/safeDisplay"

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

  const foundedYear = developer.foundedYear || stats.firstProjectYear
  const headquarters = developer.headquarters || "Dubai, UAE"
  const officialWebsite = developer.website || "Not listed"
  const unitsDelivered = developer.completedProjects || stats.completed || 0
  const projectCountLabel = shouldShow(developerProjects.length)
    ? `${safeNum(developerProjects.length)} projects`
    : "Projects pending"
  const propertyCountLabel = shouldShow(developerProperties.length)
    ? `${safeNum(developerProperties.length)} listings`
    : "Listings pending"
  
  const showDelivered = shouldShow(unitsDelivered)
  const showStars = shouldShow(developer.stars)
  const showHonesty = shouldShow(developer.honestyScore)
  const showAwards = shouldShow(developer.awards)

  const bannerImage = developer.bannerImage && developer.bannerImage !== "/logo.png"
    ? developer.bannerImage
    : "linear-gradient(to right, #0f172a, #1e3a8a)" // CSS fallback

  const description = developer.description || `${developer.name} is a ${developer.tier || "leading"} UAE developer with ${developerProjects.length || 0} active projects.`

  return (
    <>
        <section className="relative border-b border-border py-20 overflow-hidden">
          {/* Banner Fallback (Codex 3.6) */}
          <div className="absolute inset-0 z-0">
            {developer.bannerImage && developer.bannerImage !== "/logo.png" ? (
              <img src={developer.bannerImage} className="w-full h-full object-cover opacity-20" />
            ) : (
              <div className="w-full h-full opacity-10" style={{ background: bannerImage }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background" />
          </div>

          <div className="container relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Logo Fallback (Codex 3.5) */}
              <div className="h-24 w-24 rounded-2xl border-2 border-border bg-card shadow-xl flex items-center justify-center overflow-hidden shrink-0">
                {developer.logo && developer.logo !== "/logo.png" ? (
                  <img src={developer.logo} alt={developer.name} className="h-full w-full object-contain p-2" />
                ) : (
                  <div className="text-4xl font-bold text-primary">{developer.name?.[0]}</div>
                )}
              </div>
              
              <div>
                <Badge className="mb-4 gold-gradient" variant="secondary">
                  Developer Profile
                </Badge>
                <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  {developer.name}
                </h1>
                <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                  {description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="rounded-full border border-border px-3 py-1">
                    {developer.tier ? `${developer.tier} developer` : "Dubai developer"}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1">
                    {projectCountLabel}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1">
                    {propertyCountLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-10">
                {/* Critical Stats Bar (Codex 3.1, 3.2, 3.3) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {showDelivered && (
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <div className="text-xs uppercase text-muted-foreground mb-1">Delivered</div>
                      <div className="text-2xl font-bold">{safeNum(unitsDelivered)} units</div>
                    </div>
                  )}
                  {showStars && (
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <div className="text-xs uppercase text-muted-foreground mb-1">Rating</div>
                      <div className="text-2xl font-bold text-yellow-500">{developer.stars?.toFixed(1)} ★</div>
                    </div>
                  )}
                  {showHonesty && (
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <div className="text-xs uppercase text-muted-foreground mb-1">Trust Score</div>
                      <div className="text-2xl font-bold gold-text-gradient">{safeScore(developer.honestyScore)}</div>
                    </div>
                  )}
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <div className="text-xs uppercase text-muted-foreground mb-1">Avg Yield</div>
                    <div className="text-2xl font-bold text-green-600">{safePercent(stats.avgYield)}</div>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold mb-4">Track Record</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {developer.trackRecord || "Consistent delivery across prime Dubai communities and mixed-use districts."}
                  </p>
                </div>

                {showAwards && (
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-3">Awards</h3>
                    <div className="flex flex-wrap gap-2">
                      {developer.awards?.map((award) => (
                        <Badge key={award} variant="secondary" className="px-3 py-1">
                          {award}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-serif text-xl font-semibold mb-3">Top 5 Areas of Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.topAreas.length ? (
                      stats.topAreas.map((area) => (
                        <Badge key={area.area} variant="secondary">
                          {area.area} · {shouldShow(area.count) ? safeNum(area.count) : "—"}
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
                              Score: {shouldShow(project.marketScore) ? safeNum(project.marketScore) : "N/A"}
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
                        <span className="text-foreground">{unitsDeliveredLabel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>On-time delivery rate</span>
                        <span className="text-foreground">{onTimeLabel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Avg market score</span>
                        <span className="text-foreground">{avgScoreLabel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Golden Visa eligible</span>
                        <span className="text-foreground">{goldenVisaLabel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Price range</span>
                        <span className="text-foreground">
                          {minPriceLabel} - {maxPriceLabel}
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
                <div className="mt-2 text-lg font-semibold">{listingsLabel}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Active</div>
                <div className="mt-2 text-lg font-semibold">{activeLabel}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Completed</div>
                <div className="mt-2 text-lg font-semibold">{completedLabel}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Avg Yield</div>
                <div className="mt-2 text-lg font-semibold">{avgYieldLabel}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Avg Score</div>
                <div className="mt-2 text-lg font-semibold">{avgScoreLabel}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">GV Count</div>
                <div className="mt-2 text-lg font-semibold">{goldenVisaLabel}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Price Range</div>
                <div className="mt-2 text-lg font-semibold">
                  {minPriceLabel} - {maxPriceLabel}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Units Delivered</div>
                <div className="mt-2 text-lg font-semibold">{unitsDeliveredLabel}</div>
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
    </>
  )
}
