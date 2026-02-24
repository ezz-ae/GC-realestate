"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone, Instagram, Linkedin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
  const footerSections = [
    {
      title: "Main",
      links: [
        { href: "/", label: "Home" },
        { href: "/properties", label: "Properties" },
        { href: "/projects", label: "Projects" },
        { href: "/developers", label: "Developers" },
        { href: "/areas", label: "Areas" },
        { href: "/blog", label: "Blog" },
        { href: "/chat", label: "AI Assistant" },
        { href: "/tools", label: "Tools Hub" },
      ],
    },
    {
      title: "Market",
      links: [
        { href: "/market", label: "Market Hub" },
        { href: "/market/why-dubai", label: "Why Dubai" },
        { href: "/market/areas", label: "Areas Guide" },
        { href: "/market/golden-visa", label: "Golden Visa" },
        { href: "/market/financing", label: "Financing" },
        { href: "/market/trends", label: "Market Analysis" },
        { href: "/market/regulations", label: "Regulations" },
      ],
    },
    {
      title: "Financing",
      links: [
        { href: "/market/financing", label: "Overview" },
        { href: "/market/financing#calculator", label: "Mortgage Calculator" },
        { href: "/market/financing#loan-options", label: "Loan Options" },
        { href: "/market/financing#documents", label: "Required Documents" },
        { href: "/market/financing#banks", label: "Partner Banks" },
        { href: "/market/financing#pre-approval", label: "Get Pre-Approved" },
      ],
    },
    {
      title: "Market Analysis",
      links: [
        { href: "/market/trends", label: "Overview" },
        { href: "/market/trends#metrics", label: "Key Metrics" },
        { href: "/market/trends#price-trends", label: "Price Trends" },
        { href: "/market/trends#segments", label: "Market Segments" },
        { href: "/market/trends#reports", label: "Market Reports" },
        { href: "/market/trends#ai-cta", label: "AI Market Analyst" },
      ],
    },
    {
      title: "Tools",
      links: [
        { href: "/tools", label: "Tools Hub" },
        { href: "/tools/roi-calculator", label: "ROI Calculator" },
        { href: "/tools/payment-simulator", label: "Payment Simulator" },
        { href: "/tools/comparator", label: "Project Comparator" },
        { href: "/tools/ai-discovery", label: "AI Discovery" },
        { href: "/tools/market-tracker", label: "Market Tracker" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About" },
        { href: "/services", label: "Services" },
        { href: "/contact", label: "Contact" },
      ],
    },
  ]

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr,2fr]">
          <div className="space-y-8">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo_blsck.png"
                alt="Gold Century Real Estate"
                width={635}
                height={771}
                className="h-14 w-auto dark:hidden"
              />
              <Image
                src="/white_logo.png"
                alt="Gold Century Real Estate"
                width={635}
                height={771}
                className="hidden h-14 w-auto dark:block"
              />
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
              Gold Century Real Estate delivers investment intelligence
              and premium access to Dubai's top-performing projects
              for international buyers.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Downtown Dubai, UAE
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                +971 50 750 5175
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                hello@goldcentury.ae
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="icon" variant="outline" className="rounded-full h-10 w-10" aria-label="LinkedIn" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full h-10 w-10" aria-label="Instagram" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full h-10 w-10" aria-label="WhatsApp" asChild>
                <a href="https://wa.me/971507505175" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {footerSections.slice(0, 4).map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
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

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Gold Century Real Estate. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
