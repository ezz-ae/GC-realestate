import { Button } from "@/components/ui/button"
import { Target, Eye, Instagram, ExternalLink } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "About Us | Gold Century Real Estate",
  description: "Learn about Gold Century Real Estate - Dubai's trusted partner for international property investment with 15+ years of experience.",
}

export default function AboutPage() {
  const chairmanReelUrl =
    "https://www.instagram.com/reel/DT-xFjfESjt/?utm_source=ig_web_button_share_sheet"
  const chairmanReelEmbedUrl = "https://www.instagram.com/reel/DT-xFjfESjt/embed"

  return (
    <>
        {/* Hero Section */}
        <section className="relative bg-background py-20 md:py-24 border-b">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-6xl">
                About <span className="gold-text-gradient">Gold Century</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Your trusted partner for Dubai real estate investment, combining 15+ years of market expertise with powerful AI-driven intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
              <div className="flex items-start gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border bg-card shadow-sm">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold">Our Mission</h2>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    To empower international investors with transparent, data-driven intelligence, making Dubai real estate accessible and profitable for everyone, from first-time buyers to institutional funds.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border bg-card shadow-sm">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold">Our Vision</h2>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    To be the world's most trusted and technologically advanced platform for Dubai real estate investment, setting new standards for transparency, efficiency, and client success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="bg-muted/30 py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                Leadership
              </h2>
              <p className="mt-4 text-muted-foreground">
                Chairman
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <div className="text-sm uppercase tracking-widest text-muted-foreground">Chairman</div>
              <div className="mt-3 font-serif text-3xl font-bold tracking-tight">MOUSTAFA ABOU HICHME</div>
            </div>
          </div>
        </section>

        {/* Chairman Reel */}
        <section className="py-20 border-b">
          <div className="container">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                Chairman On Instagram
              </h2>
              <p className="mt-4 text-muted-foreground">
                Watch the latest reel from Gold Century Real Estate.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.15fr,1fr]">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <iframe
                  src={chairmanReelEmbedUrl}
                  title="Gold Century Instagram Reel"
                  className="w-full min-h-[560px]"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>

              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gold-gradient">
                  <Instagram className="h-6 w-6 text-black" />
                </div>
                <h3 className="mt-4 font-serif text-2xl font-bold">Gold Century Real Estate</h3>
                <p className="mt-2 text-muted-foreground">
                  Follow <span className="font-semibold">@goldcentury.ae</span> for market updates, leadership insights, and Dubai investment highlights.
                </p>
                <Button className="mt-6 gold-gradient text-black font-semibold" asChild>
                  <a href={chairmanReelUrl} target="_blank" rel="noopener noreferrer">
                    Open Reel On Instagram
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                Our Impact in Numbers
              </h2>
              <p className="mt-4 text-muted-foreground">
                Reflecting our commitment to excellence and client success.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 rounded-xl bg-card border">
                <div className="text-5xl font-bold gold-text-gradient">15+</div>
                <div className="mt-2 text-sm font-semibold">Years in Business</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border">
                <div className="text-5xl font-bold gold-text-gradient">$2B+</div>
                <div className="mt-2 text-sm font-semibold">Properties Sold</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border">
                <div className="text-5xl font-bold gold-text-gradient">50+</div>
                <div className="mt-2 text-sm font-semibold">Client Nationalities</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border">
                <div className="text-5xl font-bold gold-text-gradient">3500+</div>
                <div className="mt-2 text-sm font-semibold">Verified Projects</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-muted py-20 border-t">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                Start Your Investment Journey
              </h2>
              <p className="mt-4 text-muted-foreground">
                Let our experienced team guide you through Dubai's real estate market.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="gold-gradient text-black font-semibold h-12 px-8" asChild>
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                  <Link href="/properties">Browse Properties</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
    </>
  )
}
