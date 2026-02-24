import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, FileText, Globe, Shield, HeadphonesIcon, Home, Briefcase, Check } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Our Services | Gold Century Real Estate",
  description: "Comprehensive real estate services for international investors in Dubai - from property search to portfolio management and Golden Visa support.",
}

export default function ServicesPage() {
  const services = [
    {
      icon: Search,
      title: "Property Search & Acquisition",
      description: "Access our database of 3500+ verified Dubai properties with AI-powered search to find your perfect investment match.",
      features: [
        "Personalized property recommendations",
        "Virtual and in-person viewings",
        "Negotiation and offer management",
        "Due diligence and verification",
        "Transaction coordination"
      ]
    },
    {
      icon: TrendingUp,
      title: "Investment Advisory",
      description: "Expert guidance on Dubai real estate investment strategies tailored to your financial goals and risk profile.",
      features: [
        "Market analysis and insights",
        "ROI projections and calculations",
        "Portfolio diversification strategies",
        "Tax and legal considerations",
        "Entry and exit timing recommendations"
      ]
    },
    {
      icon: Globe,
      title: "International Buyer Support",
      description: "Comprehensive support designed specifically for international investors navigating Dubai's property market.",
      features: [
        "Legal framework guidance for foreigners",
        "Freehold area recommendations",
        "Currency exchange assistance",
        "Remote purchase facilitation",
        "Document translation services"
      ]
    },
    {
      icon: Shield,
      title: "Golden Visa Assistance",
      description: "Navigate the UAE Golden Visa program and secure long-term residency through real estate investment.",
      features: [
        "Eligibility assessment",
        "Property recommendations (AED 2M+)",
        "Application process guidance",
        "Documentation support",
        "Family sponsorship advice"
      ]
    },
    {
      icon: Briefcase,
      title: "Portfolio Management",
      description: "Ongoing management and optimization of your Dubai real estate portfolio for maximum returns.",
      features: [
        "Performance tracking and reporting",
        "Market value assessments",
        "Rental yield optimization",
        "Portfolio rebalancing recommendations",
        "Exit strategy planning"
      ]
    },
    {
      icon: Home,
      title: "Property Management",
      description: "Full-service property management to protect and maximize the value of your investment.",
      features: [
        "Tenant sourcing and screening",
        "Rent collection and accounting",
        "Maintenance coordination",
        "Legal compliance management",
        "Regular property inspections"
      ]
    },
    {
      icon: FileText,
      title: "Mortgage & Financing",
      description: "Connect with leading UAE banks and secure competitive financing for your Dubai property purchase.",
      features: [
        "Lender comparison and selection",
        "Pre-approval assistance",
        "Foreign buyer mortgage guidance",
        "Payment plan structuring",
        "Interest rate negotiation"
      ]
    },
    {
      icon: HeadphonesIcon,
      title: "After-Sales Support",
      description: "Continued support after your purchase to ensure a smooth ownership experience.",
      features: [
        "Utility connection assistance",
        "Handover coordination",
        "Furnishing recommendations",
        "Insurance guidance",
        "Ongoing market updates"
      ]
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-background to-muted py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Our <span className="gold-text-gradient">Services</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                End-to-end real estate services designed for international investors seeking opportunities in Dubai
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <div key={index} className="group rounded-lg border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg gold-gradient">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold">{service.title}</h3>
                    <p className="mt-3 text-muted-foreground">{service.description}</p>
                    
                    <ul className="mt-6 space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-muted/30 py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                Why Choose Gold Century
              </h2>
              <p className="mt-4 text-muted-foreground">
                We go beyond traditional brokerage to deliver comprehensive investment support
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full gold-gradient">
                  <span className="text-xl font-bold text-primary-foreground">1</span>
                </div>
                <h3 className="font-serif text-xl font-semibold">Local Expertise</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  15+ years of deep Dubai market knowledge and developer relationships
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full gold-gradient">
                  <span className="text-xl font-bold text-primary-foreground">2</span>
                </div>
                <h3 className="font-serif text-xl font-semibold">Global Perspective</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Understanding of international investor needs across 50+ countries
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full gold-gradient">
                  <span className="text-xl font-bold text-primary-foreground">3</span>
                </div>
                <h3 className="font-serif text-xl font-semibold">Technology-Driven</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  AI-powered search and data-driven insights for smarter decisions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Schedule a consultation to discuss how we can help you achieve your Dubai investment goals
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="gold-gradient" asChild>
                  <Link href="/contact">Book Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/properties">Explore Properties</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
