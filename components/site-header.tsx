"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/projects", label: "Projects" },
  { href: "/areas", label: "Areas" },
  { href: "/developers", label: "Developers" },
  { href: "/blog", label: "Blog" },
]

const marketLinks = [
  { href: "/market", label: "Market Hub", description: "Overview of Dubai market intelligence." },
  { href: "/market/why-dubai", label: "Why Dubai", description: "Investment case and macro advantages." },
  { href: "/market/areas", label: "Areas Guide", description: "Area-by-area comparison and insights." },
  { href: "/market/golden-visa", label: "Golden Visa", description: "Residency rules and eligibility." },
  { href: "/market/financing", label: "Financing", description: "Mortgage and payment plan options." },
  { href: "/market/trends", label: "Market Trends", description: "Reports, analytics, and forecasts." },
  { href: "/market/regulations", label: "Regulations", description: "Legal framework for buyers." },
]

const toolsLinks = [
  { href: "/tools", label: "Tools Hub", description: "All investment tools in one place." },
  { href: "/tools/roi-calculator", label: "ROI Calculator", description: "Estimate returns and yield." },
  { href: "/tools/payment-simulator", label: "Payment Simulator", description: "Model payment plans quickly." },
  { href: "/tools/comparator", label: "Project Comparator", description: "Compare projects side by side." },
  { href: "/tools/ai-discovery", label: "AI Discovery", description: "Ask AI to find matches." },
  { href: "/tools/market-tracker", label: "Market Tracker", description: "Track performance by area." },
]

const companyLinks = [
  { href: "/about", label: "About", description: "Who we are and our mission." },
  { href: "/services", label: "Services", description: "Advisory and investment support." },
  { href: "/contact", label: "Contact", description: "Speak with the team." },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-[80px] items-center justify-between md:h-[96px]">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo-light.png"
            alt="Gold Century Real Estate"
            width={240}
            height={70}
            className="h-16 w-auto md:h-20 dark:hidden"
            priority
          />
          <Image
            src="/logo-dark.png"
            alt="Gold Century Real Estate"
            width={240}
            height={70}
            className="hidden h-16 w-auto md:h-20 dark:block"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center md:flex">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-2">
              {primaryNav.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem>
                <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                  Market
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[520px] p-2">
                  <div className="grid gap-2 p-2 md:grid-cols-2">
                    {marketLinks.map((item) => (
                      <NavigationMenuLink asChild key={item.href}>
                        <Link
                          href={item.href}
                          className="rounded-md border border-transparent p-3 transition hover:border-border hover:bg-muted/60"
                        >
                          <div className="text-sm font-semibold text-foreground">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                  Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[480px] p-2">
                  <div className="grid gap-2 p-2 md:grid-cols-2">
                    {toolsLinks.map((item) => (
                      <NavigationMenuLink asChild key={item.href}>
                        <Link
                          href={item.href}
                          className="rounded-md border border-transparent p-3 transition hover:border-border hover:bg-muted/60"
                        >
                          <div className="text-sm font-semibold text-foreground">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[420px] p-2">
                  <div className="grid gap-2 p-2">
                    {companyLinks.map((item) => (
                      <NavigationMenuLink asChild key={item.href}>
                        <Link
                          href={item.href}
                          className="rounded-md border border-transparent p-3 transition hover:border-border hover:bg-muted/60"
                        >
                          <div className="text-sm font-semibold text-foreground">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="hidden md:inline-flex gold-gradient">
            <Link href="/contact">Get Started</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 pt-6">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Image
                    src="/logo-light.png"
                    alt="Gold Century Real Estate"
                    width={220}
                    height={64}
                    className="h-14 w-auto dark:hidden"
                  />
                  <Image
                    src="/logo-dark.png"
                    alt="Gold Century Real Estate"
                    width={220}
                    height={64}
                    className="hidden h-14 w-auto dark:block"
                  />
                </Link>
                <nav className="flex flex-col gap-6 text-sm">
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Main</div>
                    {primaryNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Market</div>
                    {marketLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Tools</div>
                    {toolsLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Company</div>
                    {companyLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </nav>
                <Button asChild className="gold-gradient w-full">
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
