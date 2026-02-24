import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
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

export const metadata: Metadata = {
  title: "Gold Century Real Estate | Dubai Property Investment",
  description: "Investment intelligence for Dubai real estate. Discover 3500+ luxury properties, off-plan projects, and exclusive opportunities in Dubai's premier locations.",
  generator: 'v0.app',
  keywords: ['Dubai real estate', 'Dubai properties', 'Dubai investment', 'off-plan Dubai', 'Golden Visa', 'Dubai Marina', 'Downtown Dubai'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
