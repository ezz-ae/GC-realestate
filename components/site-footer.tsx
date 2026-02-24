"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone, Instagram, Linkedin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,2fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo-light.png"
                alt="Gold Century Real Estate"
                width={160}
                height={44}
                className="dark:hidden"
              />
              <Image
                src="/logo-dark.png"
                alt="Gold Century Real Estate"
                width={160}
                height={44}
                className="hidden dark:block"
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

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide">Explore</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/properties" className="hover:text-foreground">Properties</Link>
                </li>
                <li>
                  <Link href="/projects" className="hover:text-foreground">Projects</Link>
                </li>
                <li>
                  <Link href="/areas" className="hover:text-foreground">Areas</Link>
                </li>
                <li>
                  <Link href="/developers" className="hover:text-foreground">Developers</Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground">Blog</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide">Market</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/market" className="hover:text-foreground">Market Hub</Link>
                </li>
                <li>
                  <Link href="/market/why-dubai" className="hover:text-foreground">Why Dubai</Link>
                </li>
                <li>
                  <Link href="/market/golden-visa" className="hover:text-foreground">Golden Visa</Link>
                </li>
                <li>
                  <Link href="/market/trends" className="hover:text-foreground">Market Trends</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide">Tools</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/tools/roi-calculator" className="hover:text-foreground">ROI Calculator</Link>
                </li>
                <li>
                  <Link href="/tools/payment-simulator" className="hover:text-foreground">Payment Simulator</Link>
                </li>
                <li>
                  <Link href="/tools/comparator" className="hover:text-foreground">Project Comparator</Link>
                </li>
                <li>
                  <Link href="/tools/ai-discovery" className="hover:text-foreground">AI Discovery</Link>
                </li>
              </ul>
            </div>
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
