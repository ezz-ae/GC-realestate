import Link from "next/link"
import { notFound } from "next/navigation"
import { ProjectCard } from "@/components/project-card"
import { PropertyCard } from "@/components/property-card"
import { SmallLeadForm } from "@/components/small-lead-form"
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
import {
  safeNum,
  safePercent,
  safePrice,
  safeScore,
  shouldShow,
  getAvatarInitial,
  nameToColor,
} from "@/lib/utils/safeDisplay"
import { filterAuthorizedDevelopers, isAuthorizedDeveloper } from "@/lib/utils/authorized"

const fallbackStats = {
  listings: 0,
  active: 0,
  completed: 0,
  avgYield: 0,
  avgScore: 0,
  goldenVisaCount: 0,
  minPrice: 0,
  maxPrice: 0,
  onTimeDeliveryRate: null,
  firstProjectYear: null,
  topAreas: [] as Array<{ area: string; count: number }>,
  flagshipProjects: [] as Array<{ id: string; slug: string; name: string; marketScore: number | null }>,
}

export async function generateStaticParams() {
  const rawDevelopers = await getDevelopers().catch(() => [])
  const developers = filterAuthorizedDevelopers(rawDevelopers)
  return developers
    .map((developer) => ({ slug: developer.slug }))
    .filter((params) => Boolean(params.slug))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const developer = await getDeveloperBySlug(slug).catch(() => null)
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
  const developer = await getDeveloperBySlug(slug).catch(() => null)

  if (!developer || !isAuthorizedDeveloper(developer)) {
    notFound()
  }

  const developerName = developer.name || "Unknown Developer"
  const [projectsResult, propertiesResult, statsResult] = await Promise.allSettled([
    getProjectsByDeveloper(developerName, 6),
    getPropertiesByDeveloper(developerName, 6),
    getDeveloperStats(developerName),
  ])

  const developerProjects = projectsResult.status === "fulfilled" ? projectsResult.value : []
  const developerProperties = propertiesResult.status === "fulfilled" ? propertiesResult.value : []
  const stats = statsResult.status === "fulfilled" ? statsResult.value : fallbackStats

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
  const PRICE_FALLBACK = "Price on Request"
  const minPriceLabel = safePrice(stats.minPrice)
  const maxPriceLabel = safePrice(stats.maxPrice)
  const priceRangeLabel = (() => {
    if (minPriceLabel === PRICE_FALLBACK && maxPriceLabel === PRICE_FALLBACK) {
      return PRICE_FALLBACK
    }
    if (minPriceLabel === PRICE_FALLBACK) return `Up to ${maxPriceLabel}`
    if (maxPriceLabel === PRICE_FALLBACK) return `${minPriceLabel}+`
    return `${minPriceLabel} - ${maxPriceLabel}`
  })()
  const showPriceRange = shouldShow(stats.minPrice) || shouldShow(stats.maxPrice)
  const showDelivered = shouldShow(unitsDelivered)
  const showStars = shouldShow(developer.stars)
  const showHonesty = shouldShow(developer.honestyScore)
  const trustSignalRows = [
    {
      label: "Units delivered",
      value: safeNum(unitsDelivered),
      show: shouldShow(unitsDelivered),
    },
    {
      label: "On-time delivery rate",
      value: safePercent(stats.onTimeDeliveryRate),
      show: shouldShow(stats.onTimeDeliveryRate),
    },
    {
      label: "Avg market score",
      value: safeScore(stats.avgScore),
      show: shouldShow(stats.avgScore),
    },
    {
      label: "Golden Visa eligible",
      value: safeNum(stats.goldenVisaCount),
      show: shouldShow(stats.goldenVisaCount),
    },
  ]
  const overviewStats = [
    { label: "Listings", value: safeNum(stats.listings), show: shouldShow(stats.listings) },
    { label: "Active", value: safeNum(stats.active), show: shouldShow(stats.active) },
    { label: "Completed", value: safeNum(stats.completed), show: shouldShow(stats.completed) },
    { label: "Avg Yield", value: safePercent(stats.avgYield), show: shouldShow(stats.avgYield) },
    { label: "Avg Score", value: safeScore(stats.avgScore), show: shouldShow(stats.avgScore) },
    { label: "GV Count", value: safeNum(stats.goldenVisaCount), show: shouldShow(stats.goldenVisaCount) },
  ]
  const visibleTrustRows = trustSignalRows.filter((row) => row.show)

  return (
    <>
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
              {developerProjects.length > 0 && (
                <span className="rounded-full border border-border px-3 py-1">
                  {developerProjects.length} projects
                </span>
              )}
              {developerProperties.length > 0 && (
                <span className="rounded-full border border-border px-3 py-1">
                  {developerProperties.length} listings
                </span>
              )}
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
                      <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Delivered</div>
                      <div className="text-2xl font-bold">{safeNum(unitsDelivered)} units</div>
                    </div>
                  )}
                  {showStars && (
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Rating</div>
                      <div className="text-2xl font-bold text-yellow-500">{developer.stars?.toFixed(1)} ★</div>
                    </div>
                  )}
                  {showHonesty && (
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Trust Score</div>
                      <div className="text-2xl font-bold gold-text-gradient">{safeScore(developer.honestyScore)}</div>
                    </div>
                  )}
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Avg Yield</div>
                    <div className="text-2xl font-bold text-green-600">{safePercent(stats.avgYield)}</div>
                  </div>
                </div>

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
                      {visibleTrustRows.length > 0 ? (
                        visibleTrustRows.map((row) => (
                          <div key={row.label} className="flex items-center justify-between">
                            <span>{row.label}</span>
                            <span className="text-foreground">{row.value}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                          Trust signals are being updated.
                        </div>
                      )}
                      {showPriceRange && (
                        <div className="flex items-center justify-between">
                          <span>Price range</span>
                          <span className="text-foreground">{priceRangeLabel}</span>
                        </div>
                      )}
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
              {overviewStats.map(
                (stat) =>
                  stat.show && (
                    <div key={stat.label}>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</div>
                      <div className="mt-2 text-lg font-semibold">{stat.value}</div>
                    </div>
                  ),
              )}
              {showPriceRange && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Price Range</div>
                  <div className="mt-2 text-lg font-semibold">{priceRangeLabel}</div>
                </div>
              )}
              {shouldShow(unitsDelivered) && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Units Delivered</div>
                  <div className="mt-2 text-lg font-semibold">{safeNum(unitsDelivered)}</div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_20px_45px_rgba(15,23,42,0.2)] md:p-10">
              <SmallLeadForm
                source={developer.name}
                title={`Discuss ${developer.name} projects`}
                caption="Get a quick summary of available inventory, ROI expectations, and financing options."
              />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_20px_45px_rgba(15,23,42,0.2)] md:p-10">
              <SmallLeadForm
                source={developer.name}
                title={`Discuss ${developer.name} projects`}
                caption="Get a quick summary of available inventory, ROI expectations, and financing options."
              />
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
