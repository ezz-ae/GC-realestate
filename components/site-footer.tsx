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
        { href: "/market/trends", label: "Market Trends" },
        { href: "/market/regulations", label: "Regulations" },
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
        { href: "/dashboard/leads", label: "Leads Dashboard" },
      ],
    },
  ]

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,2.6fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo-light.png"
                alt="Gold Century Real Estate"
                width={240}
                height={70}
                className="h-16 w-auto dark:hidden"
              />
              <Image
                src="/logo-dark.png"
                alt="Gold Century Real Estate"
                width={240}
                height={70}
                className="hidden h-16 w-auto dark:block"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Gold Century Real Estate delivers investment intelligence and premium access to Dubai's
              top-performing projects for international buyers.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Downtown Dubai, UAE
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                +971 50 123 4567
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                hello@goldcentury.ae
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="icon" variant="outline" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" aria-label="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wide">{section.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-t border-border pt-6 md:grid-cols-[2fr,1fr] md:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Gold Century Real Estate. All rights reserved.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Input
              type="email"
              placeholder="Email for Dubai market updates"
              className="h-9 sm:w-64"
            />
            <Button size="sm" className="gold-gradient">Subscribe</Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
