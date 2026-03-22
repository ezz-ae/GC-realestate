import { AISearchBar } from "@/components/ai-search-bar"
import { FeaturedProperties } from "@/components/featured-properties"
import { MarketSnapshot } from "@/components/market-snapshot"
import { BlogSection } from "@/components/blog-section"
import { Button } from "@/components/ui/button"
import { TrendingUp, Building2, MapPin, Sparkles, MessageSquare, Search, Map } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <>
        {/* Experience Plane: Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted py-24 md:py-40">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
                The Decision Layer for{" "}
                <span className="gold-text-gradient">Dubai Real Estate</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground text-balance md:text-xl">
                Advanced intelligence for property investors. 3500+ projects, verified data, AI-driven insights.
              </p>
              
              {/* Primary Actions: Chat, Search, Map */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="gold-gradient h-14 px-8 text-lg" asChild>
                  <Link href="/chat">
                    <MessageSquare className="mr-2 h-5 w-5" /> AI Chat
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg" asChild>
                  <Link href="/search">
                    <Search className="mr-2 h-5 w-5" /> Search Engine
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg" asChild>
                  <Link href="/map">
                    <Map className="mr-2 h-5 w-5" /> Spatial Map
                  </Link>
                </Button>
              </div>

              {/* 3 Golden Path Buttons (TableSpec JSON presets) */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Button variant="ghost" className="h-auto p-6 border border-border hover:border-primary/50 flex flex-col items-center gap-3 bg-card/50" asChild>
                  <Link href="/chat?q=Show+me+highest+yield+projects+in+Dubai+Marina">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div className="text-center">
                      <div className="font-bold">Yield Analysis</div>
                      <div className="text-xs text-muted-foreground">High-yield ROI ranking</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="ghost" className="h-auto p-6 border border-border hover:border-primary/50 flex flex-col items-center gap-3 bg-card/50" asChild>
                  <Link href="/chat?q=Show+me+projects+completing+in+2025+under+2M+AED">
                    <Building2 className="h-8 w-8 text-primary" />
                    <div className="text-center">
                      <div className="font-bold">Supply Tracker</div>
                      <div className="text-xs text-muted-foreground">Projects by delivery date</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="ghost" className="h-auto p-6 border border-border hover:border-primary/50 flex flex-col items-center gap-3 bg-card/50" asChild>
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
