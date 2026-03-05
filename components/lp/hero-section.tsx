import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LeadCaptureForm } from "@/components/lp/lead-capture-form"
import type { CampaignPixelIds } from "@/lib/landing-pages"

interface HeroSectionProps {
  data: Record<string, unknown>
  fallbackTitle: string
  fallbackSubtitle: string
  heroImage: string
  ctaText: string
  landingSlug: string
  projectSlug: string
  pixels: CampaignPixelIds
}

export function HeroSection({
  data,
  fallbackTitle,
  fallbackSubtitle,
  heroImage,
  ctaText,
  landingSlug,
  projectSlug,
  pixels,
}: HeroSectionProps) {
  const title = (typeof data.title === "string" && data.title) || fallbackTitle
  const subtitle = (typeof data.subtitle === "string" && data.subtitle) || fallbackSubtitle
  const eyebrow = (typeof data.eyebrow === "string" && data.eyebrow) || "Project Campaign"

  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0">
        <Image src={heroImage} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/40" />
      </div>

      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="max-w-3xl space-y-6 text-white">
            <Badge className="gold-gradient border-none">{eyebrow}</Badge>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
            <p className="max-w-2xl text-lg text-white/85 md:text-xl">{subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="gold-gradient text-primary-foreground">
                <a href="#lead-form-section">{ctaText}</a>
              </Button>
              <Button asChild variant="outline" className="border-white/40 bg-black/20 text-white hover:bg-black/35">
                <Link href="#download-brochure">Download Brochure</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-black/35 p-3 backdrop-blur-sm">
            <LeadCaptureForm
              landingSlug={landingSlug}
              projectSlug={projectSlug}
              pixels={pixels}
              ctaText="Get Brochure"
              formId="hero-lead-form"
              cardClassName="border-white/15 bg-black/25 text-white shadow-none [&_label]:text-white [&_input]:bg-black/30 [&_input]:border-white/20"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
