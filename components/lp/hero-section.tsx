import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeroSectionProps {
  data: Record<string, unknown>
  fallbackTitle: string
  fallbackSubtitle: string
  heroImage: string
  ctaText: string
}

export function HeroSection({ data, fallbackTitle, fallbackSubtitle, heroImage, ctaText }: HeroSectionProps) {
  const title = (typeof data.title === "string" && data.title) || fallbackTitle
  const subtitle = (typeof data.subtitle === "string" && data.subtitle) || fallbackSubtitle
  const eyebrow = (typeof data.eyebrow === "string" && data.eyebrow) || "Project Campaign"

  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0">
        <Image src={heroImage} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/40" />
      </div>

      <div className="container relative z-10 py-20 md:py-28">
        <div className="max-w-3xl space-y-6 text-white">
          <Badge className="gold-gradient border-none">{eyebrow}</Badge>
          <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
          <p className="max-w-2xl text-lg text-white/85 md:text-xl">{subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="gold-gradient text-primary-foreground">
              <a href="#lead-form">{ctaText}</a>
            </Button>
            <Button asChild variant="outline" className="border-white/40 bg-black/20 text-white hover:bg-black/35">
              <Link href="#key-facts">View Key Facts</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
