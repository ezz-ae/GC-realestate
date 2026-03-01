import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import "./globals.css"

export const dynamic = "force-dynamic"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-serif",
})

const metadataBaseUrl = process.env.METADATA_BASE || "https://goldcentury.ae"

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: {
    default: "Gold Century Real Estate",
    template: "%s | Gold Century Real Estate",
  },
  description:
    "Investment intelligence for Dubai real estate. Discover 3,500+ luxury properties, exclusive developer launches, and AI-powered market guidance with Gold Century.",
  generator: "v0.app",
  keywords: [
    "Dubai real estate",
    "Dubai properties",
    "Dubai investment",
    "off-plan Dubai",
    "Golden Visa",
    "Dubai Marina",
    "Downtown Dubai",
    "Dubai market intelligence",
    "investment advisors",
  ],
  openGraph: {
    title: "Gold Century Real Estate | Dubai Property Intelligence",
    description:
      "Gold Century delivers curated Dubai projects, off-plan intelligence, and broker-grade AI insight for international investors.",
    url: new URL(metadataBaseUrl),
    siteName: "Gold Century Real Estate",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${metadataBaseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Gold Century Real Estate Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold Century Real Estate",
    description:
      "Dubai investment intelligence with 3,500+ verified projects, AI chat, and CRM-grade leads.",
    images: [
      `${metadataBaseUrl}/og-image.png`,
    ],
    creator: "@goldcentury",
  },
  icons: {
    icon: [
      "/favicon.ico",
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Gold Century Real Estate",
    "image": "https://goldcentury.ae/logo_blsck.png",
    "@id": "https://goldcentury.ae",
    "url": "https://goldcentury.ae",
    "telephone": "+971501234567",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Business Bay",
      "addressLocality": "Dubai",
      "addressRegion": "Dubai",
      "addressCountry": "AE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.185,
      "longitude": 55.275
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/goldcentury.ae",
      "https://www.instagram.com/goldcentury.ae/",
      "https://www.linkedin.com/company/goldcentury"
    ]
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${geistMono.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
