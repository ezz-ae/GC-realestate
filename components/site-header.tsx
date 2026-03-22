"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, Sparkles, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { LeadFormPopup } from "@/components/lead-form-popup"

const mainLinks = [
  { href: "/", label: "Home", description: "Platform overview and market highlights." },
  { href: "/properties", label: "Properties", description: "Browse 3,655 live listings." },
  { href: "/projects", label: "Projects", description: "Master developments and launches." },
  { href: "/areas", label: "Areas", description: "Compare districts and demand." },
  { href: "/developers", label: "Developers", description: "Track records and delivery stats." },
  { href: "/blog", label: "Blog", description: "Investor insights and reports." },
  { href: "/chat", label: "AI Assistant", description: "Get a curated shortlist fast." },
  { href: "/market/trends", label: "Market Analysis", description: "Live market reports and forecasts." },
]

const marketLinks = [
  { href: "/market/trends", label: "Market Analysis", description: "Reports, analytics, and forecasts." },
  { href: "/market", label: "Market Hub", description: "Overview of Dubai market intelligence." },
  { href: "/market/why-dubai", label: "Why Dubai", description: "Investment case and macro advantages." },
  { href: "/market/areas", label: "Areas Guide", description: "Area-by-area comparison and insights." },
  { href: "/market/golden-visa", label: "Golden Visa", description: "Residency rules and eligibility." },
  { href: "/market/financing", label: "Financing", description: "Mortgage and payment plan options." },
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
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const megaMenuWide = "w-[min(720px,92vw)] min-w-[360px] p-2"
  const megaMenuMedium = "w-[min(640px,92vw)] min-w-[340px] p-2"
  const megaMenuCompact = "w-[min(520px,92vw)] min-w-[320px] p-2"

  if (pathname?.startsWith("/crm")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 h-20 transition-all duration-300">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 shrink-0 transition-opacity hover:opacity-90">
          <Image
            src="/logo_blsck.png"
            alt="Gold Century Real Estate"
            width={635}
            height={771}
            className="h-16 w-auto md:h-20 dark:hidden"
            priority
          />
          <Image
            src="/white_logo.png"
            alt="Gold Century Real Estate"
            width={635}
            height={771}
            className="hidden h-16 w-auto md:h-20 dark:block"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-center md:flex">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                  Properties
                </NavigationMenuTrigger>
                <NavigationMenuContent className={megaMenuWide}>
                  <div className="grid gap-2 p-2 md:grid-cols-2">
                    {mainLinks.map((item) => (
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
                  Market
                </NavigationMenuTrigger>
                <NavigationMenuContent className={megaMenuWide}>
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
                <NavigationMenuContent className={megaMenuMedium}>
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
                <NavigationMenuContent className={megaMenuCompact}>
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
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="border border-border/40 text-foreground"
          >
            <a href="https://wa.me/97150000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageCircle className="h-4 w-4" />
            </a>
          </Button>
          <LeadFormPopup
            buttonLabel="Free consultation"
            buttonClassName="hidden md:inline-flex"
            buttonSize="sm"
          />
          <Button asChild className="hidden md:inline-flex gold-gradient">
            <Link href="/chat">AI Assistant</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-[360px] p-0 border-l">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
                    <Image
                      src="/logo_blsck.png"
                      alt="Gold Century Real Estate"
                      width={120}
                      height={40}
                      className="h-12 w-auto dark:hidden"
                    />
                    <Image
                      src="/white_logo.png"
                      alt="Gold Century Real Estate"
                      width={120}
                      height={40}
                      className="hidden h-12 w-auto dark:block"
                    />
                  </Link>
                </div>
                
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-6 space-y-8 pb-20">
                    <div className="space-y-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 px-1">
                        Properties
                      </div>
                      <div className="grid gap-1">
                        {mainLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex flex-col gap-0.5 rounded-lg p-3 text-sm font-medium transition-colors hover:bg-muted active:bg-muted"
                          >
                            <span className="text-base">{item.label}</span>
                            <span className="text-xs font-normal text-muted-foreground line-clamp-1">{item.description}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 px-1">
                        Market Intelligence
                      </div>
                      <div className="grid gap-1">
                        {marketLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex flex-col gap-0.5 rounded-lg p-3 text-sm font-medium transition-colors hover:bg-muted active:bg-muted"
                          >
                            <span className="text-base">{item.label}</span>
                            <span className="text-xs font-normal text-muted-foreground line-clamp-1">{item.description}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 px-1">
                        Investment Tools
                      </div>
                      <div className="grid gap-1">
                        {toolsLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex flex-col gap-0.5 rounded-lg p-3 text-sm font-medium transition-colors hover:bg-muted active:bg-muted"
                          >
                            <span className="text-base">{item.label}</span>
                            <span className="text-xs font-normal text-muted-foreground line-clamp-1">{item.description}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 px-1">
                        Company
                      </div>
                      <div className="grid gap-1">
                        {companyLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex flex-col gap-0.5 rounded-lg p-3 text-sm font-medium transition-colors hover:bg-muted active:bg-muted"
                          >
                            <span className="text-base">{item.label}</span>
                            <span className="text-xs font-normal text-muted-foreground line-clamp-1">{item.description}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="p-6 border-t bg-muted/30">
                  <Button asChild className="w-full gold-gradient shadow-lg" size="lg">
                    <Link href="/chat" onClick={() => setIsOpen(false)}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Assistant
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
