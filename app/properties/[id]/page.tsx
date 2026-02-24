import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Car,
  Heart,
  Share2,
  Phone,
  Mail,
  MessageSquare,
  TrendingUp,
  Award,
  Calendar,
  Building2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getProperties, getPropertyBySlug } from "@/lib/entrestate"
import { notFound } from "next/navigation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateStaticParams() {
  const properties = await getProperties(5)
  return properties.map((property) => ({
    id: property.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getPropertyBySlug(id)
  if (!property) {
    return { title: "Property Not Found" }
  }
  return {
    title: `${property.title} | Gold Century Real Estate`,
    description: property.description || `${property.title} in ${property.location.area}, Dubai.`,
  }
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getPropertyBySlug(id)

  if (!property) {
    notFound()
  }

  const usdPrice = property.currency === "AED" ? Math.round(property.price / 3.67) : property.price
  const nearbyLandmarks = property.nearbyLandmarks ?? []
  const bedroomLabel =
    property.specifications.bedrooms === 0 ? "Studio" : `${property.specifications.bedrooms} Bedrooms`
  const coordinates = property.location.coordinates || { lat: 0, lng: 0 }
  const heroImage = property.images?.[0] || "/logo.png"
  const heroImageClass = property.images?.[0] ? "object-cover" : "object-contain bg-card"
  const description =
    property.description ||
    `Explore ${property.title} in ${property.location.area}, offering premium finishes and a prime location in Dubai.`
  const highlights =
    property.highlights?.length
      ? property.highlights
      : [
          bedroomLabel,
          `${property.specifications.sizeSqft} sqft`,
          `${property.specifications.parkingSpaces} parking`,
          property.specifications.view || "City view",
          property.location.freehold ? "Freehold" : "Leasehold",
          property.investmentMetrics.goldenVisaEligible ? "Golden Visa eligible" : "Investment ready",
        ].filter(Boolean)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Image Gallery */}
        <section className="relative h-[42vh] min-h-[320px] bg-muted">
          <Image
            src={heroImage}
            alt={property.title}
            fill
            className={heroImageClass}
            sizes="(min-width: 1280px) 1200px, (min-width: 768px) 90vw, 100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          {/* Floating Action Buttons */}
          <div className="absolute right-4 top-4 flex gap-2">
            <Button size="icon" variant="secondary" className="rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Property Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="gold-gradient">
                    {property.type === "off-plan"
                      ? "Off-Plan"
                      : property.type === "secondary"
                        ? "Secondary"
                        : "Commercial"}
                  </Badge>
                  <Badge variant="outline">{property.location.area}</Badge>
                  {property.investmentMetrics.goldenVisaEligible && (
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                      <Award className="mr-1 h-3 w-3" />
                      Golden Visa
                    </Badge>
                  )}
                  {property.location.freehold && (
                    <Badge variant="secondary">Freehold</Badge>
                  )}
                </div>

                <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                  {property.title}
                </h1>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location.area}, Dubai, UAE</span>
                </div>

                <div className="flex flex-wrap items-baseline gap-4">
                  <div>
                    <span className="text-3xl font-bold gold-text-gradient">
                      AED {property.price.toLocaleString()}
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      (${usdPrice.toLocaleString()} USD)
                    </span>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{bedroomLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.specifications.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.specifications.sizeSqft} sqft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.specifications.parkingSpaces} Parking</span>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="investment">Investment</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 py-6">
                  <div>
                    <h3 className="mb-4 font-serif text-xl font-semibold">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-4 font-serif text-xl font-semibold">Property Highlights</h3>
                    <ul className="grid gap-3 md:grid-cols-2">
                      {highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-6 py-6">
                  <div>
                    <h3 className="mb-4 font-serif text-xl font-semibold">Amenities & Facilities</h3>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
                          <div className="h-2 w-2 rounded-full gold-gradient" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 font-serif text-xl font-semibold">Specifications</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Property Type</div>
                          <div className="mt-1 font-medium">{property.category}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Completion</div>
                          <div className="mt-1 font-medium">{property.completionDate || "Ready"}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Furnishing</div>
                          <div className="mt-1 font-medium">
                            {property.specifications.furnished ? "Furnished" : "Unfurnished"}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">View</div>
                          <div className="mt-1 font-medium">{property.specifications.view}</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="investment" className="space-y-6 py-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                      <CardContent className="p-6">
                        <div className="mb-2 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <span className="text-sm text-muted-foreground">Expected ROI</span>
                        </div>
                        <div className="text-2xl font-bold gold-text-gradient">{property.investmentMetrics.roi}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="mb-2 flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-primary" />
                          <span className="text-sm text-muted-foreground">Rental Yield</span>
                        </div>
                        <div className="text-2xl font-bold gold-text-gradient">
                          {property.investmentMetrics.rentalYield}%
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="mb-2 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span className="text-sm text-muted-foreground">Appreciation</span>
                        </div>
                        <div className="text-2xl font-bold gold-text-gradient">
                          {property.investmentMetrics.appreciationRate}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="mb-4 font-serif text-xl font-semibold">Investment Analysis</h3>
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          This property offers strong investment potential with an expected ROI of {property.investmentMetrics.roi}% 
                          and annual rental yields of {property.investmentMetrics.rentalYield}%. Located in {property.location.area}, one of 
                          Dubai's most sought-after neighborhoods, the property benefits from excellent connectivity 
                          and premium amenities.
                        </p>
                        {property.investmentMetrics.goldenVisaEligible && (
                          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                            <div className="flex items-start gap-3">
                              <Award className="h-5 w-5 text-amber-600 mt-0.5" />
                              <div>
                                <div className="font-medium text-amber-900 dark:text-amber-100">
                                  Golden Visa Eligible
                                </div>
                                <div className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                                  This property qualifies for UAE Golden Visa, offering 5-10 year residency 
                                  with the option to sponsor family members.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-6 py-6">
                  <div>
                    <h3 className="mb-4 font-serif text-xl font-semibold">Location & Connectivity</h3>
                    <div className="rounded-lg border border-border bg-card p-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-semibold">{property.location.area}</div>
                          <div className="text-sm text-muted-foreground">
                            {property.location.district}, {property.location.city}
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Coordinates: {coordinates.lat}, {coordinates.lng}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 font-serif text-xl font-semibold">Nearby Landmarks</h3>
                    <div className="space-y-3">
                      {nearbyLandmarks.map((landmark, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                          <span className="font-medium">{landmark.name}</span>
                          <span className="text-sm text-muted-foreground">{landmark.distance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Card */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-serif text-xl font-semibold">Interested in this property?</h3>
                    <p className="text-sm text-muted-foreground">
                      Contact our expert team for more information or to schedule a viewing.
                    </p>
                    <div className="space-y-3">
                      <Button className="w-full gold-gradient" size="lg" asChild>
                        <a href="tel:+971501234567">
                          <Phone className="mr-2 h-4 w-4" />
                          Call Now
                        </a>
                      </Button>
                      <Button className="w-full" variant="outline" size="lg" asChild>
                        <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          WhatsApp
                        </a>
                      </Button>
                      <Button className="w-full" variant="outline" size="lg" asChild>
                        <a href="mailto:info@goldcentury.ae">
                          <Mail className="mr-2 h-4 w-4" />
                          Email Inquiry
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Developer Card */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-serif text-lg font-semibold">Developer</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg gold-gradient">
                        <Building2 className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{property.developer.name}</div>
                        <div className="text-sm text-muted-foreground">Trusted Developer</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/developers">View All Properties</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-serif text-lg font-semibold">Property ID</h3>
                    <div className="text-sm text-muted-foreground">GC-{property.id.slice(0, 8).toUpperCase()}</div>
                    <Separator />
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Listed</span>
                        <span className="font-medium">2 weeks ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Views</span>
                        <span className="font-medium">234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Inquiries</span>
                        <span className="font-medium">18</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
