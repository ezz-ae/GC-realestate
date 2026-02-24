import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Assistant | Gold Century Real Estate",
  description:
    "Instant answers on Dubai real estate, curated projects, and market intelligence from the Gold Century AI assistant.",
  openGraph: {
    title: "AI Assistant | Gold Century",
    description:
      "Ask the AI assistant about Dubai market trends, Golden Visa projects, and curated property recommendations.",
    url: "https://goldcentury.ae/chat",
    siteName: "Gold Century Real Estate",
    type: "website",
    images: [
      {
        url: "https://goldcentury.ae/ai-og.png",
        width: 1200,
        height: 630,
        alt: "Gold Century AI Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold Century AI Assistant",
    description:
      "Talk to the AI assistant for instant Dubai property intelligence and curated project shortlists.",
    images: ["https://goldcentury.ae/ai-og.png"],
  },
}
