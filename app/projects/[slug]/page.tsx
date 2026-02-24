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
  Building2,
  Check,
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
  const developer = project.developer || { name: "Gold Century", logo: "" }
  const phoneNumber = "+971501234567"
  const heroImage = project.heroImage || "/logo.png"
  const heroImageClass = project.heroImage ? "object-cover" : "object-contain bg-card"

  const priceRange = getPriceRange(project)

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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                <div className="text-2xl font-bold gold-text-gradient">{paymentPlan.downPayment}%</div>
                <div className="mt-1 text-sm text-muted-foreground">Down Payment</div>
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
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="units">Units</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="payment">Payment Plan</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-8 space-y-8">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">About {project.name}</h2>
                      <p className="mt-4 text-muted-foreground leading-relaxed">
                        {project.longDescription}
                      </p>
                    </div>

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
                  </TabsContent>

                  <TabsContent value="units" className="mt-8">
                    <h2 className="font-serif text-2xl font-bold mb-6">Available Units</h2>
                    <div className="space-y-4">
                      {units.map((unit: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
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
                              </div>
                              <div className="text-right">
                                <div className="font-semibold gold-text-gradient text-lg">
                                  {getUnitPriceRange(unit)}
                                </div>
                                <Button size="sm" className="mt-2" variant="outline">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="amenities" className="mt-8">
                    <h2 className="font-serif text-2xl font-bold mb-6">World-Class Amenities</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="mt-8">
                    <h2 className="font-serif text-2xl font-bold mb-6">Prime Location</h2>
                    <div className="space-y-4">
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
                  </TabsContent>

                  <TabsContent value="payment" className="mt-8">
                    <h2 className="font-serif text-2xl font-bold mb-6">Flexible Payment Plan</h2>
                    <div className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-3">
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
                      </div>
                    </div>
                  </TabsContent>
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
