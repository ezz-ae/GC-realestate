import { AISearchBar } from "@/components/ai-search-bar"
import { FeaturedProperties } from "@/components/featured-properties"
import { MarketSnapshot } from "@/components/market-snapshot"
import { BlogSection } from "@/components/blog-section"
import { Button } from "@/components/ui/button"
import { IntelligenceBlock } from "@/components/IntelligenceBlock"
import { getIntelligenceBlockData } from "@/lib/intelligence-block"
import { TrendingUp, Building2, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"

const heroPrompts = [
  "Best ROI projects in 2026",
  "Golden Visa eligible properties",
  "Off-plan projects in Downtown Dubai",
  "2BR apartments under AED 2M",
]

export default async function Home() {
  const intelligence = await getIntelligenceBlockData()
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 md:py-32">
        <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(#a1a1aa_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-7xl leading-[1.1]">
              Intelligence for{" "}
              <span className="gold-text-gradient">Dubai Real Estate</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground text-balance md:text-xl max-w-2xl mx-auto">
              Discover 3500+ luxury properties and exclusive off-plan projects.
              Your gateway to profitable investment in Dubai.
            </p>
            
            <div className="mt-10 mx-auto max-w-3xl">
              <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-2xl backdrop-blur">
                <AISearchBar showSuggestions={false} />
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Try:
                  </span>
                  {heroPrompts.map((prompt) => (
                    <Link
                      key={prompt}
                      href={`/chat?q=${encodeURIComponent(prompt)}`}
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-white hover:text-white"
                    >
                      {prompt}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="gold-gradient text-black font-semibold h-12 px-8" asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                <Link href="/market/why-dubai">Why Dubai</Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Hero Contact Section */}
      <section className="relative z-20 pb-12">
        <div className="container">
          <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card/90 p-6 shadow-2xl backdrop-blur">
            <div className="mb-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Get a free consultation by our well-experienced team
              </p>
              <h3 className="font-serif text-3xl font-bold">
                Schedule a call with our Dubai investment specialists
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Drop your name and WhatsApp/phone number, and we will respond within one business hour with a tailored plan.
              </p>
            </div>
            <form className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col space-y-1 text-xs uppercase tracking-widest text-muted-foreground">
                Full Name
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  className="rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
              </label>
              <label className="flex flex-col space-y-1 text-xs uppercase tracking-widest text-muted-foreground">
                WhatsApp or Phone
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+971 50 750 5175"
                  className="rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
              </label>
              <label className="sm:col-span-2 flex flex-col space-y-1 text-xs uppercase tracking-widest text-muted-foreground">
                Message (optional)
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Budget, preferred areas, timeline..."
                  className="resize-none rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
              </label>
              <div className="sm:col-span-2 flex justify-center">
                <Button type="submit" className="gold-gradient w-full max-w-sm" size="lg">
                  Request a callback
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Live Intelligence */}
      <IntelligenceBlock data={intelligence} />

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
