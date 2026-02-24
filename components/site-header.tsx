"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

const mainNav = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/developers", label: "Developers" },
  { href: "/projects", label: "Projects" },
  { href: "/market", label: "Dubai Market" },
  { href: "/areas", label: "Areas" },
  { href: "/tools", label: "Tools" },
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
        <nav className="hidden items-center gap-6 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
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
                <nav className="flex flex-col gap-4">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
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
