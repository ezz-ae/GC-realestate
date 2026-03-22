import { AISearchBar } from "@/components/ai-search-bar"
import { FeaturedProperties } from "@/components/featured-properties"
import { MarketSnapshot } from "@/components/market-snapshot"
import { BlogSection } from "@/components/blog-section"
import { Button } from "@/components/ui/button"
import { TrendingUp, Building2, Sparkles, MessageSquare, Map } from "lucide-react"
import Link from "next/link"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <>
        {/* Premium Video Hero Section */}
        <HeroSection />

        {/* Action Center: AI Search & Golden Paths */}
        <section className="relative z-20 -mt-20 pb-20">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              {/* Search Bar Overlay */}
              <div className="rounded-3xl bg-background/80 shadow-2xl backdrop-blur-xl border border-white/20 p-2 sm:p-4 mb-12">
                <AISearchBar />
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                <Button size="lg" variant="outline" className="h-12 px-6 rounded-full bg-background/50 backdrop-blur-md" asChild>
                  <Link href="/chat">
                    <MessageSquare className="mr-2 h-4 w-4 text-primary" /> AI Assistant
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-6 rounded-full bg-background/50 backdrop-blur-md" asChild>
                  <Link href="/map">
                    <Map className="mr-2 h-4 w-4 text-primary" /> Spatial Map
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-6 rounded-full bg-background/50 backdrop-blur-md" asChild>
                  <Link href="/properties">Browse Projects</Link>
                </Button>
              </div>

              {/* Golden Path Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button variant="ghost" className="h-auto p-6 border border-border hover:border-primary/50 flex flex-col items-center gap-3 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md" asChild>
                  <Link href="/chat?q=Show+me+highest+yield+projects+in+Dubai+Marina">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div className="text-center">
                      <div className="font-bold">Yield Analysis</div>
                      <div className="text-xs text-muted-foreground">High-yield ROI ranking</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="ghost" className="h-auto p-6 border border-border hover:border-primary/50 flex flex-col items-center gap-3 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md" asChild>
                  <Link href="/chat?q=Show+me+projects+completing+in+2025+under+2M+AED">
                    <Building2 className="h-8 w-8 text-primary" />
                    <div className="text-center">
                      <div className="font-bold">Supply Tracker</div>
                      <div className="text-xs text-muted-foreground">Projects by delivery date</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="ghost" className="h-auto p-6 border border-border hover:border-primary/50 flex flex-col items-center gap-3 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md" asChild>
                  <Link href="/chat?q=Find+Golden+Visa+eligible+projects+near+Downtown">
                    <Sparkles className="h-8 w-8 text-primary" />
                    <div className="text-center">
                      <div className="font-bold">Visa Eligible</div>
                      <div className="text-xs text-muted-foreground">Investment migration paths</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar Section */}
        <section className="border-y border-border bg-card py-10 overflow-hidden">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-xl font-serif font-bold italic">EMAAR</div>
              <div className="text-xl font-serif font-bold italic">DAMAC</div>
              <div className="text-xl font-serif font-bold italic">MERAAS</div>
              <div className="text-xl font-serif font-bold italic">SOBHA</div>
              <div className="text-xl font-serif font-bold italic">SELECT GROUP</div>
              <div className="text-xl font-serif font-bold italic">AZIZI</div>
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
    </>
  )
}
