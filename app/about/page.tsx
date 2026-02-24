import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Award, Users, Globe, Shield, TrendingUp, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "About Us | Gold Century Real Estate",
  description: "Learn about Gold Century Real Estate - Dubai's trusted partner for international property investment with 15+ years of experience.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-background to-muted py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                About <span className="gold-text-gradient">Gold Century</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Your trusted partner for Dubai real estate investment, serving international buyers since 2009
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                  Our Story
                </h2>
                <div className="mt-6 space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2009, Gold Century Real Estate has established itself as a premier destination for 
                    international investors seeking opportunities in Dubai's dynamic property market. Our journey 
                    began with a simple vision: to bridge the gap between global investors and Dubai's world-class 
                    real estate offerings.
                  </p>
                  <p>
                    Over 15 years, we've facilitated over $2 billion in property transactions, helping clients from 
                    50+ countries achieve their investment goals. Our deep market knowledge, combined with 
                    cutting-edge technology and AI-powered insights, ensures our clients make informed decisions 
                    in one of the world's most exciting property markets.
                  </p>
                  <p>
                    Today, we manage a comprehensive database of 3500+ verified projects across Dubai, offering 
                    our clients unparalleled access to off-plan developments, secondary market properties, and 
                    exclusive investment opportunities.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border">
                  <div className="flex h-full items-center justify-center bg-muted">
                    <div className="text-center">
                      <Image
                        src="/logo.png"
                        alt="Gold Century Real Estate"
                        width={300}
                        height={120}
                        className="mx-auto"
                      />
                      <p className="mt-4 text-sm text-muted-foreground">Dubai skyline image</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-muted/30 py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                Our Values
              </h2>
              <p className="mt-4 text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full gold-gradient">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Trust & Transparency</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  We believe in complete transparency. Every property listing includes verified data, honest ROI projections, and clear terms.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full gold-gradient">
                  <Globe className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Global Perspective</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  With clients from 50+ countries, we understand the unique needs and concerns of international investors.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full gold-gradient">
                  <TrendingUp className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Results-Driven</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Your success is our success. We focus on delivering measurable returns and long-term value for our clients.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full gold-gradient">
                  <Award className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Excellence</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  We maintain the highest standards in everything we do, from property selection to client service.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full gold-gradient">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Client-Centric</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Your goals drive our recommendations. We take time to understand your unique investment objectives.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full gold-gradient">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Long-Term Partnership</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  We're here for the long haul, providing ongoing support from property search to portfolio management.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                Our Impact
              </h2>
              <p className="mt-4 text-muted-foreground">
                Numbers that reflect our commitment to excellence
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-4xl font-bold gold-text-gradient md:text-5xl">15+</div>
                <div className="mt-2 text-sm font-medium">Years in Business</div>
                <div className="mt-1 text-xs text-muted-foreground">Since 2009</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gold-text-gradient md:text-5xl">$2B+</div>
                <div className="mt-2 text-sm font-medium">Properties Sold</div>
                <div className="mt-1 text-xs text-muted-foreground">Total transaction value</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gold-text-gradient md:text-5xl">50+</div>
                <div className="mt-2 text-sm font-medium">Countries</div>
                <div className="mt-1 text-xs text-muted-foreground">International clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gold-text-gradient md:text-5xl">3500+</div>
                <div className="mt-2 text-sm font-medium">Verified Projects</div>
                <div className="mt-1 text-xs text-muted-foreground">Across Dubai</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-muted py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                Ready to Start Your Investment Journey?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Let our experienced team guide you through Dubai's real estate market
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="gold-gradient" asChild>
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/properties">Browse Properties</Link>
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
