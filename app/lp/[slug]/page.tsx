import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getLandingPageBySlug } from "@/lib/landing-pages"
import { HeroSection } from "@/components/lp/hero-section"
import { SectionRenderer } from "@/components/lp/section-renderer"
import { PixelScripts } from "@/components/lp/pixel-scripts"
import { LpAnalyticsTracker } from "@/components/lp/lp-analytics-tracker"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const landing = await getLandingPageBySlug(slug)

  if (!landing) {
    return {
      title: "Campaign Not Found",
      description: "This campaign page is not available.",
    }
  }

  return {
    title: landing.seo.title,
    description: landing.seo.description,
    openGraph: {
      title: landing.seo.title,
      description: landing.seo.description,
      images: [landing.seo.ogImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: landing.seo.title,
      description: landing.seo.description,
      images: [landing.seo.ogImage],
    },
  }
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const landing = await getLandingPageBySlug(slug)
  if (!landing) notFound()

  const heroSection = landing.sections.find((section) => section.type === "hero")
  const bodySections = landing.sections.filter((section) => section.type !== "hero")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: landing.title,
    description: landing.subtitle,
    image: landing.heroImage,
    url: `https://goldcentury.ae/lp/${landing.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Gold Century Real Estate",
      url: "https://goldcentury.ae",
    },
  }

  return (
    <>
      <PixelScripts pixels={landing.pixels} />
      <LpAnalyticsTracker landingSlug={landing.slug} projectSlug={landing.projectSlug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HeroSection
        data={heroSection?.data || {}}
        fallbackTitle={landing.title}
        fallbackSubtitle={landing.subtitle}
        heroImage={landing.heroImage}
        ctaText={landing.ctaText}
        landingSlug={landing.slug}
        projectSlug={landing.projectSlug}
        pixels={landing.pixels}
      />

      <SectionRenderer
        sections={bodySections}
        landingSlug={landing.slug}
        projectSlug={landing.projectSlug}
        ctaText={landing.ctaText}
        pixels={landing.pixels}
      />
    </>
  )
}
