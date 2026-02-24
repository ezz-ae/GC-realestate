import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AISearchBar } from "@/components/ai-search-bar"
import { FeaturedProperties } from "@/components/featured-properties"
import { MarketSnapshot } from "@/components/market-snapshot"
import { BlogSection } from "@/components/blog-section"
import { Button } from "@/components/ui/button"
import { TrendingUp, Building2, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
                Investment Intelligence for{" "}
                <span className="gold-text-gradient">Dubai Real Estate</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground text-balance md:text-xl">
                Discover 3500+ luxury properties and exclusive off-plan projects in Dubai's premier locations.
                Your gateway to profitable real estate investment.
              </p>
              
              {/* AI Search Bar */}
              <div className="mx-auto mt-10 max-w-2xl">
                <AISearchBar />
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="gold-gradient" asChild>
                  <Link href="/properties">Browse Properties</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/market/why-dubai">Why Dubai</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-card py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold gold-text-gradient md:text-4xl">3500+</div>
                <div className="mt-2 text-sm text-muted-foreground">Dubai Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gold-text-gradient md:text-4xl">15+</div>
                <div className="mt-2 text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gold-text-gradient md:text-4xl">$2B+</div>
                <div className="mt-2 text-sm text-muted-foreground">Properties Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gold-text-gradient md:text-4xl">50+</div>
                <div className="mt-2 text-sm text-muted-foreground">Countries Served</div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Snapshot */}
        <MarketSnapshot />

        {/* Featured Properties */}
        <FeaturedProperties />

        {/* Blog */}
        <BlogSection />

        {/* Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                Why Choose Gold Century
              </h2>
              <p className="mt-4 text-muted-foreground">
                Your trusted partner for Dubai real estate investment
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gold-gradient">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold">High ROI</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Average 8-12% rental yields on Dubai properties with strong appreciation potential
                </p>
              </div>

              <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gold-gradient">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold">3500+ Projects</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Comprehensive database of verified developments across all Dubai locations
                </p>
              </div>

              <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gold-gradient">
                  <MapPin className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Golden Visa</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Access properties eligible for UAE Golden Visa and long-term residency
                </p>
              </div>

              <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gold-gradient">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold">AI-Powered</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Smart search and personalized recommendations powered by advanced AI
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                Ready to Invest in Dubai Real Estate?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Schedule a consultation with our expert team to explore investment opportunities tailored to your goals
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="gold-gradient" asChild>
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/market">Explore Dubai Market</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Simple Footer */}
      <SiteFooter />
    </div>
  )
}
