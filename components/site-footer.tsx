"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Mail, MapPin, Phone, Instagram, Linkedin, MessageCircle, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LeadFormPopup } from "@/components/lead-form-popup"

const footerSections = [
  {
    title: "Platform",
    links: [
      { href: "/", label: "Home" },
      { href: "/properties", label: "Properties" },
      { href: "/projects", label: "Projects" },
      { href: "/search", label: "Project Search" },
      { href: "/areas", label: "Area Profiles" },
      { href: "/developers", label: "Developers" },
      { href: "/chat", label: "AI Assistant" },
      { href: "/tools", label: "Tools Hub" },
    ],
  },
  {
    title: "Market Intelligence",
    links: [
      { href: "/market", label: "Market Hub" },
      { href: "/market/trends", label: "Market Analysis" },
      { href: "/market/trends#metrics", label: "Key Metrics" },
      { href: "/market/areas", label: "Area Guide" },
      { href: "/market/golden-visa", label: "Golden Visa" },
      { href: "/market/regulations", label: "Regulations" },
    ],
  },
  {
    title: "Financing & Reports",
    links: [
      { href: "/market/financing", label: "Financing Overview" },
      { href: "/market/financing#calculator", label: "Mortgage Calculator" },
      { href: "/market/financing#loan-options", label: "Loan Options" },
      { href: "/market/financing#documents", label: "Required Documents" },
      { href: "/market/financing#banks", label: "Partner Banks" },
      { href: "/market/financing#pre-approval", label: "Get Pre-Approved" },
    ],
  },
  {
    title: "Tools & Analytics",
    links: [
      { href: "/tools", label: "Tools Hub" },
      { href: "/tools/payment-simulator", label: "Payment Simulator" },
      { href: "/tools/roi-calculator", label: "ROI Calculator" },
      { href: "/tools/comparator", label: "Project Comparator" },
      { href: "/tools/market-tracker", label: "Market Tracker" },
      { href: "/api/intelligence-block", label: "Live Pulse API" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/services", label: "Services" },
      { href: "/contact", label: "Contact" },
      { href: "/blog", label: "Insights" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
]

export function SiteFooter() {
  const pathname = usePathname()

  if (pathname?.startsWith("/crm")) {
    return null
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr,2.1fr]">
          <div className="space-y-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo_blsck.png"
                alt="Gold Century Real Estate"
                width={635}
                height={771}
                className="h-16 w-auto dark:hidden md:h-20 md:drop-shadow-xl"
              />
              <Image
                src="/white_logo.png"
                alt="Gold Century Real Estate"
                width={635}
                height={771}
                className="hidden h-16 w-auto dark:block md:h-20 md:drop-shadow-xl"
              />
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed max-w-lg text-pretty">
              Gold Century Real Estate delivers curated Dubai projects, market intelligence, and CRM-powered execution for international investors. Every insight is backed by live data from Entrestate Intelligence.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span>Business Bay · Downtown Dubai, UAE</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span>+971 50 750 5175</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span>hello@goldcentury.ae</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Instagram className="h-4 w-4 text-primary" />
                </div>
                <a
                  href="https://www.instagram.com/goldcentury.ae/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Gold Century Real Estate (@goldcentury.ae) · Dubai
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="icon" variant="outline" className="rounded-full h-10 w-10" aria-label="Facebook" asChild>
                <a href="https://www.facebook.com/goldcentury.ae" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full h-10 w-10" aria-label="LinkedIn" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full h-10 w-10" aria-label="Instagram" asChild>
                <a href="https://www.instagram.com/goldcentury.ae/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full h-10 w-10" aria-label="WhatsApp" asChild>
                <a href="https://wa.me/971507505175" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Request a market brief
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input placeholder="Name · WhatsApp or Email" className="flex-1" />
                <LeadFormPopup />
              </div>
              <p className="text-xs text-muted-foreground">
                By sharing your details we can send curated intelligence and licensed project data directly to your inbox or WhatsApp.
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Gold Century Real Estate · Live market data by Entrestate.com. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">Terms</Link>
              <Link href="/robots.txt" className="text-xs text-muted-foreground hover:text-foreground">Robots</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
