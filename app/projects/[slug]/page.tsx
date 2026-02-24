import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { LeadForm } from "@/components/lead-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { notFound } from "next/navigation"
import { ProjectPdfDownload } from "@/components/project-pdf-download"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  TrendingUp,
  Calendar,
  Clock,
  Building2,
  Check,
  FileText,
  PlayCircle,
  ExternalLink,
  Phone,
  MessageCircle,
  Home,
  Maximize,
} from "lucide-react"
import { getProjectBySlug, getProjectsForGrid, searchProjects } from "@/lib/entrestate"
import type { Project } from "@/lib/types/project"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

const getProject = async (slug: string) => {
  const normalizedSlug = decodeURIComponent(slug).trim()
  const direct = await getProjectBySlug(normalizedSlug)
  if (direct) return direct
  const fallback = await searchProjects(normalizedSlug, 1)
  return fallback[0] || null
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value)

const getPriceRange = (project: Project) => {
  const prices = (project.units || [])
    .flatMap((unit) => [unit.priceFrom, unit.priceTo])
    .filter((price): price is number => typeof price === "number" && Number.isFinite(price))
  if (!prices.length) {
    return "Pricing on request"
  }
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
}

const getUnitPriceRange = (unit: {
  priceFrom?: number | null
  priceTo?: number | null
}) => {
  const from = typeof unit.priceFrom === "number" ? unit.priceFrom : null
  const to = typeof unit.priceTo === "number" ? unit.priceTo : null
  if (from == null && to == null) {
    return "Price on request"
  }
  if (from != null && to != null) {
    return `${formatPrice(from)} - ${formatPrice(to)}`
  }
  const value = from ?? to ?? 0
  return formatPrice(value)
}

const toArray = <T,>(value: T[] | null | undefined) => (Array.isArray(value) ? value : [])

const getSizeRange = (units: Project["units"]) => {
  const sizes = units
    .flatMap((unit) => [unit.sizeFrom, unit.sizeTo])
    .filter((size): size is number => typeof size === "number" && Number.isFinite(size))
  if (!sizes.length) return ""
  return `${Math.min(...sizes).toLocaleString()} - ${Math.max(...sizes).toLocaleString()} sq ft`
}

const getUnitTypes = (units: Project["units"]) => {
  const types = units.map((unit) => unit.type).filter(Boolean)
  return Array.from(new Set(types))
}

const getAvailabilityCount = (units: Project["units"]) =>
  units.reduce((sum, unit) => sum + (Number.isFinite(unit.available) ? unit.available : 0), 0)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)
  
  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  const priceRange = getPriceRange(project)
  const heroImage = project.heroImage || "/logo.png"
  const heroImageClass = project.heroImage ? "object-cover" : "object-contain bg-card"

  const locationArea = project.location?.area || "Dubai"

  return {
    title: project.seoTitle || `${project.name} - ${project.tagline} | Gold Century Real Estate`,
    description:
      project.seoDescription ||
      `${project.longDescription} Starting from ${priceRange}. Golden Visa eligible. Contact us today.`,
    keywords: project.seoKeywords?.length
      ? project.seoKeywords
      : [project.name, locationArea, "Dubai property", "off-plan Dubai", "Golden Visa", "investment"],
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    const suggestions = await getProjectsForGrid(6)
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <section className="py-16">
            <div className="container">
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <h1 className="font-serif text-3xl font-bold">Project Not Found</h1>
                <p className="mt-3 text-muted-foreground">
                  This project may have been renamed or removed. Explore our latest projects below.
                </p>
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {suggestions.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <h2 className="font-semibold">{item.name}</h2>
                        <p className="text-sm text-muted-foreground">{item.tagline}</p>
                        <Button className="mt-4 w-full" variant="outline" asChild>
                          <Link href={`/projects/${item.slug}`}>View Project</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6">
                  <Button className="gold-gradient" asChild>
                    <Link href="/projects">Browse All Projects</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const location = project.location || {
    area: "Dubai",
    district: "Dubai",
    city: "Dubai",
    coordinates: { lat: 0, lng: 0 },
    freehold: false,
    nearbyLandmarks: [],
  }
  const timeline = project.timeline || {
    launchDate: "",
    constructionStart: "",
    expectedCompletion: "TBD",
    handoverDate: "TBD",
    progressPercentage: 0,
  }
  const paymentPlan = project.paymentPlan || {
    downPayment: 0,
    duringConstruction: 0,
    onHandover: 0,
    postHandover: 0,
  }
  const highlights = toArray(project.highlights)
  const amenities = toArray(project.amenities)
  const units = toArray(project.units)
  const landmarks = toArray(location.nearbyLandmarks)
  const constructionUpdates = toArray(project.constructionUpdates)
  const testimonials = toArray(project.testimonials)
  const faqs = toArray(project.faqs)
  const developer = project.developer || { name: "Gold Century", logo: "" }
  const phoneNumber = "+971501234567"
  const heroImage = project.heroImage || "/logo.png"
  const heroImageClass = project.heroImage ? "object-cover" : "object-contain bg-card"

  const priceRange = getPriceRange(project)
  const unitTypes = getUnitTypes(units)
  const sizeRange = getSizeRange(units)
  const availabilityCount = getAvailabilityCount(units)
  const hasTimeline =
    Boolean(timeline.launchDate || timeline.constructionStart || timeline.expectedCompletion || timeline.handoverDate) ||
    Number.isFinite(timeline.progressPercentage)
  const hasSpecifications = Boolean(project.specifications && project.specifications.trim())
  const hasMedia =
    Boolean(project.heroVideo || project.virtualTour || project.masterplan || project.brochure) ||
    toArray(project.gallery).length > 0
  const factItems = [
    { label: "Status", value: project.status?.replace("-", " ") },
    { label: "Area", value: location.area },
    { label: "District", value: location.district },
    { label: "City", value: location.city },
    { label: "Developer", value: developer.name },
    { label: "Property Types", value: unitTypes.length ? unitTypes.join(", ") : "" },
    { label: "Unit Sizes", value: sizeRange },
    {
      label: "Availability",
      value: availabilityCount ? `${availabilityCount.toLocaleString()} units` : "",
    },
    { label: "Freehold", value: location.freehold ? "Yes" : "No" },
    { label: "Handover", value: timeline.handoverDate || timeline.expectedCompletion || "" },
  ].filter((item) => item.value)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px]">
          <Image
            src={heroImage}
            alt={project.name}
            fill
            className={heroImageClass}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="container relative flex h-full flex-col justify-end pb-12">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap gap-2">
                {project.investmentHighlights?.goldenVisaEligible && (
                  <Badge className="gold-gradient">Golden Visa Eligible</Badge>
                )}
                {location.freehold && (
                  <Badge variant="secondary">Freehold</Badge>
                )}
                <Badge variant="outline" className="border-white text-white">Off-Plan</Badge>
                {project.scarcityMessage && (
                  <Badge variant="secondary" className="bg-white/15 text-white">
                    {project.scarcityMessage}
                  </Badge>
                )}
                {project.urgencyMessage && (
                  <Badge variant="secondary" className="bg-white/15 text-white">
                    {project.urgencyMessage}
                  </Badge>
                )}
              </div>
              
              <h1 className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                {project.name}
              </h1>
              <p className="mt-3 text-xl text-white/90">
                {project.tagline}
              </p>
              
              <div className="mt-6 flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{location.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span>{developer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Completion: {timeline.expectedCompletion}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <ProjectPdfDownload slug={project.slug} />
                {hasMedia && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white bg-white/10 text-white hover:bg-white/20"
                    asChild
                  >
                    <Link href="#media">
                      <PlayCircle className="mr-2 h-5 w-5" />
                      View Media
                    </Link>
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-white/10 text-white hover:bg-white/20"
                  asChild
                >
                  <Link href="/contact">
                    <Phone className="mr-2 h-5 w-5" />
                    Schedule Viewing
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-white/10 text-white hover:bg-white/20"
                  asChild
                >
                  <a href={`https://wa.me/${phoneNumber.replace("+", "")}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Stats Bar */}
        <section className="border-b border-border bg-card py-6">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
              <div className="text-center">
                <div className="text-2xl font-bold gold-text-gradient">{priceRange}</div>
                <div className="mt-1 text-sm text-muted-foreground">Price Range</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gold-text-gradient">
                  {project.investmentHighlights?.expectedROI ?? 0}%
                </div>
                <div className="mt-1 text-sm text-muted-foreground">Expected ROI</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gold-text-gradient">
                  {project.investmentHighlights?.rentalYield ?? 0}%
                </div>
                <div className="mt-1 text-sm text-muted-foreground">Rental Yield</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gold-text-gradient">
                  {timeline.handoverDate || timeline.expectedCompletion}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">Handover</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gold-text-gradient">{paymentPlan.downPayment}%</div>
                <div className="mt-1 text-sm text-muted-foreground">Down Payment</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gold-text-gradient">
                  {timeline.progressPercentage ?? 0}%
                </div>
                <div className="mt-1 text-sm text-muted-foreground">Progress</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="flex w-full flex-wrap justify-start gap-2 bg-transparent">
                    <TabsTrigger
                      value="overview"
                      className="rounded-full border border-border px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="units"
                      className="rounded-full border border-border px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Units
                    </TabsTrigger>
                    {hasMedia && (
                      <TabsTrigger
                        value="media"
                        className="rounded-full border border-border px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Media
                      </TabsTrigger>
                    )}
                    <TabsTrigger
                      value="location"
                      className="rounded-full border border-border px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Location
                    </TabsTrigger>
                    <TabsTrigger
                      value="payment"
                      className="rounded-full border border-border px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Payment Plan
                    </TabsTrigger>
                    <TabsTrigger
                      value="developer"
                      className="rounded-full border border-border px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Developer
                    </TabsTrigger>
                    {faqs.length > 0 && (
                      <TabsTrigger
                        value="faq"
                        className="rounded-full border border-border px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        FAQs
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="overview" className="mt-8 space-y-10">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">About {project.name}</h2>
                      <p className="mt-4 text-muted-foreground leading-relaxed">
                        {project.longDescription}
                      </p>
                    </div>

                    {factItems.length > 0 && (
                      <div>
                        <h3 className="font-serif text-xl font-semibold mb-4">Project Snapshot</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {factItems.map((item) => (
                            <div key={item.label} className="rounded-lg border border-border bg-card p-4">
                              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                {item.label}
                              </div>
                              <div className="mt-2 text-sm font-semibold">{item.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {hasSpecifications && (
                      <div>
                        <h3 className="font-serif text-xl font-semibold mb-4">Project Specifications</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{project.specifications}</p>
                      </div>
                    )}

                    {highlights.length > 0 && (
                      <div>
                        <h3 className="font-serif text-xl font-semibold mb-4">Investment Highlights</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {highlights.map((highlight: string, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {hasTimeline && (
                      <div>
                        <h3 className="font-serif text-xl font-semibold mb-4">Timeline & Progress</h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {timeline.launchDate && (
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  Launch
                                </div>
                                <div className="mt-2 text-sm font-semibold">{timeline.launchDate}</div>
                              </CardContent>
                            </Card>
                          )}
                          {timeline.constructionStart && (
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-4 w-4 text-primary" />
                                  Construction Start
                                </div>
                                <div className="mt-2 text-sm font-semibold">{timeline.constructionStart}</div>
                              </CardContent>
                            </Card>
                          )}
                          {timeline.expectedCompletion && (
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  Expected Completion
                                </div>
                                <div className="mt-2 text-sm font-semibold">{timeline.expectedCompletion}</div>
                              </CardContent>
                            </Card>
                          )}
                          {timeline.handoverDate && (
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  Handover
                                </div>
                                <div className="mt-2 text-sm font-semibold">{timeline.handoverDate}</div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                        <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Construction progress</span>
                            <span className="font-semibold">{timeline.progressPercentage ?? 0}%</span>
                          </div>
                          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.min(100, Math.max(0, timeline.progressPercentage ?? 0))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {amenities.length > 0 && (
                      <div>
                        <h3 className="font-serif text-xl font-semibold mb-4">Amenities & Lifestyle</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {amenities.map((amenity: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                            >
                              <Check className="h-5 w-5 text-primary flex-shrink-0" />
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {constructionUpdates.length > 0 && (
                      <div>
                        <h3 className="font-serif text-xl font-semibold mb-4">Construction Updates</h3>
                        <div className="space-y-4">
                          {constructionUpdates.map((update: any, index: number) => (
                            <Card key={`${update.date}-${index}`}>
                              <CardContent className="p-6 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <div className="text-sm font-semibold">
                                    Update {index + 1}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{update.date}</div>
                                </div>
                                <p className="text-sm text-muted-foreground">{update.description}</p>
                                {toArray(update.images).length > 0 && (
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    {toArray(update.images).map((img: string, imgIndex: number) => (
                                      <div
                                        key={`${img}-${imgIndex}`}
                                        className="relative aspect-video overflow-hidden rounded-lg"
                                      >
                                        <Image
                                          src={img}
                                          alt={`${project.name} update ${index + 1}`}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {testimonials.length > 0 && (
                      <div>
                        <h3 className="font-serif text-xl font-semibold mb-4">Investor Testimonials</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {testimonials.map((testimonial: any, index: number) => (
                            <Card key={`${testimonial.name}-${index}`}>
                              <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground">"{testimonial.quote}"</p>
                                <div className="mt-4 text-sm font-semibold">{testimonial.name}</div>
                                <div className="text-xs text-muted-foreground">{testimonial.country}</div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="units" className="mt-8">
                    <h2 className="font-serif text-2xl font-bold mb-6">Available Units</h2>
                    <div className="space-y-6">
                      {units.map((unit: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.1fr,1fr]">
                            <div>
                              <h3 className="font-semibold text-lg">{unit.type || "Unit"}</h3>
                              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Maximize className="h-4 w-4" />
                                  {unit.sizeFrom || 0} - {unit.sizeTo || 0} sq ft
                                </div>
                                <div className="flex items-center gap-1">
                                  <Home className="h-4 w-4" />
                                  {unit.available || 0} available
                                </div>
                              </div>
                              <div className="mt-4 font-semibold gold-text-gradient text-lg">
                                {getUnitPriceRange(unit)}
                              </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              {unit.floorPlan && (
                                <div className="rounded-lg border border-border bg-muted/30 p-3">
                                  <div className="text-xs text-muted-foreground mb-2">Floor Plan</div>
                                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-background">
                                    <Image
                                      src={unit.floorPlan}
                                      alt={`${project.name} floor plan`}
                                      fill
                                      className="object-contain p-2"
                                    />
                                  </div>
                                </div>
                              )}
                              {unit.interiorImage && (
                                <div className="rounded-lg border border-border bg-muted/30 p-3">
                                  <div className="text-xs text-muted-foreground mb-2">Interior</div>
                                  <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                                    <Image
                                      src={unit.interiorImage}
                                      alt={`${project.name} interior`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {hasMedia && (
                    <TabsContent value="media" className="mt-8 space-y-10">
                      <div id="media">
                        <h2 className="font-serif text-2xl font-bold">Media & Downloads</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                          Explore project visuals, masterplans, and available media assets.
                        </p>
                      </div>

                      {(project.heroVideo || project.virtualTour) && (
                        <div className="grid gap-6 lg:grid-cols-2">
                          {project.heroVideo && (
                            <div className="rounded-lg border border-border bg-card p-4">
                              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <PlayCircle className="h-4 w-4 text-primary" />
                                Project Video
                              </div>
                              <div className="relative aspect-video overflow-hidden rounded-md">
                                <iframe
                                  className="h-full w-full"
                                  src={project.heroVideo}
                                  title={`${project.name} video`}
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          )}
                          {project.virtualTour && (
                            <div className="rounded-lg border border-border bg-card p-4">
                              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <ExternalLink className="h-4 w-4 text-primary" />
                                Virtual Tour
                              </div>
                              <div className="relative aspect-video overflow-hidden rounded-md">
                                <iframe
                                  className="h-full w-full"
                                  src={project.virtualTour}
                                  title={`${project.name} virtual tour`}
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {project.masterplan && (
                        <div>
                          <h3 className="font-serif text-xl font-semibold mb-4">Masterplan</h3>
                          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border">
                            <Image
                              src={project.masterplan}
                              alt={`${project.name} masterplan`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {toArray(project.gallery).length > 0 && (
                        <div>
                          <h3 className="font-serif text-xl font-semibold mb-4">Gallery</h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {toArray(project.gallery).map((img: string, index: number) => (
                              <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                                <Image
                                  src={img}
                                  alt={`${project.name} ${index + 1}`}
                                  fill
                                  className="object-cover transition-transform hover:scale-105"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.brochure && (
                        <div className="rounded-lg border border-border bg-card p-6">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 text-sm font-semibold">
                                <FileText className="h-4 w-4 text-primary" />
                                Project Brochure
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">
                                Download the official project brochure and factsheet.
                              </p>
                            </div>
                            <Button className="gold-gradient" asChild>
                              <a href={project.brochure} target="_blank" rel="noopener noreferrer">
                                <FileText className="mr-2 h-4 w-4" />
                                Download PDF
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  )}

                  <TabsContent value="location" className="mt-8 space-y-8">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Prime Location</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {location.area}, {location.city}
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-lg border border-border bg-card p-4">
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">Area</div>
                        <div className="mt-2 text-sm font-semibold">{location.area}</div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-4">
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">District</div>
                        <div className="mt-2 text-sm font-semibold">{location.district}</div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-4">
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">Freehold</div>
                        <div className="mt-2 text-sm font-semibold">{location.freehold ? "Yes" : "No"}</div>
                      </div>
                    </div>

                    {landmarks.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-serif text-xl font-semibold">Nearby Landmarks</h3>
                        {landmarks.map((landmark: any, index: number) => (
                          <div key={index} className="flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-primary" />
                              <span>{landmark.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{landmark.distance}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="payment" className="mt-8 space-y-8">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Flexible Payment Plan</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Structured installments with clear milestones for investors.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold gold-text-gradient">
                            {paymentPlan.downPayment}%
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">Down Payment</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold gold-text-gradient">
                            {paymentPlan.duringConstruction}%
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">During Construction</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold gold-text-gradient">
                            {paymentPlan.onHandover}%
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">On Handover</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold gold-text-gradient">
                            {paymentPlan.postHandover}%
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">Post Handover</div>
                        </CardContent>
                      </Card>
                    </div>

                    {toArray(paymentPlan.installments).length > 0 && (
                      <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="font-serif text-xl font-semibold mb-4">Installment Schedule</h3>
                        <div className="space-y-3">
                          {toArray(paymentPlan.installments).map((installment: any, index: number) => (
                            <div key={`${installment.description}-${index}`} className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
                              <div>
                                <div className="text-sm font-semibold">
                                  {installment.description || `Installment ${index + 1}`}
                                </div>
                                <div className="text-xs text-muted-foreground">{installment.date}</div>
                              </div>
                              <div className="text-sm font-semibold">{installment.percentage}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="developer" className="mt-8 space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">About {developer.name}</h2>
                      <p className="mt-3 text-sm text-muted-foreground">{developer.description}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-6">
                      <div className="flex flex-wrap items-start gap-4">
                        {developer.logo && (
                          <div className="rounded-xl border border-border bg-background p-3">
                            <Image
                              src={developer.logo}
                              alt={developer.name}
                              width={120}
                              height={60}
                              className="h-10 w-auto object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-xs uppercase tracking-wide text-muted-foreground">Track record</div>
                          <div className="mt-2 text-sm font-semibold">{developer.trackRecord}</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {faqs.length > 0 && (
                    <TabsContent value="faq" className="mt-8 space-y-4">
                      <h2 className="font-serif text-2xl font-bold">Frequently Asked Questions</h2>
                      <div className="space-y-4">
                        {faqs.map((faq: any, index: number) => (
                          <Card key={`${faq.question}-${index}`}>
                            <CardContent className="p-6">
                              <div className="text-sm font-semibold">{faq.question}</div>
                              <div className="mt-2 text-sm text-muted-foreground">{faq.answer}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Lead Registration Form */}
                <Card className="sticky top-6">
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-semibold mb-2">Register Your Interest</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Fill out the form below and our team will contact you within 24 hours.
                    </p>
                    <LeadForm projectName={project.name} source="project-page" />
                  </CardContent>
                </Card>

                {/* Quick Contact Options */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h4 className="font-semibold">Need Immediate Assistance?</h4>
                    <div className="space-y-3">
                      <Button className="w-full gold-gradient" size="lg" asChild>
                        <a href={`tel:${phoneNumber}`}>
                          <Phone className="mr-2 h-5 w-5" />
                          Call Now
                        </a>
                      </Button>
                      <Button className="w-full" size="lg" variant="outline" asChild>
                        <a href={`https://wa.me/${phoneNumber.replace("+", "")}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 h-5 w-5" />
                          WhatsApp
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Highlights */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4">Why Invest?</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">High ROI</div>
                          <div className="text-muted-foreground">
                            {project.investmentHighlights?.expectedROI ?? 0}% expected return
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Golden Visa</div>
                          <div className="text-muted-foreground">Eligible for UAE residency</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Flexible Payment</div>
                          <div className="text-muted-foreground">Only {paymentPlan.downPayment}% down payment</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Prime Location</div>
                          <div className="text-muted-foreground">{location.area}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-16">
          <div className="container text-center">
            <h2 className="font-serif text-3xl font-bold">Ready to Invest in {project.name}?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Schedule a private viewing or consultation with our investment team
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gold-gradient" asChild>
                <Link href="/contact">Schedule Viewing</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/chat">Ask AI About This Project</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
