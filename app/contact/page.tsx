import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Contact Us | Gold Century Real Estate",
  description: "Get in touch with Gold Century Real Estate - Schedule a consultation, ask questions, or visit our Dubai office.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-background to-muted py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Get in <span className="gold-text-gradient">Touch</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Have questions about Dubai real estate? Our expert team is here to help you make informed investment decisions
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
              {/* Contact Info */}
              <div className="lg:col-span-1">
                <h2 className="font-serif text-2xl font-bold">Contact Information</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Reach out through any of these channels
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gold-gradient">
                      <Phone className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">Phone</div>
                      <a href="tel:+971501234567" className="text-sm text-muted-foreground hover:text-primary">
                        +971 50 123 4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gold-gradient">
                      <MessageCircle className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">WhatsApp</div>
                      <a href="https://wa.me/971501234567" className="text-sm text-muted-foreground hover:text-primary">
                        +971 50 123 4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gold-gradient">
                      <Mail className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <a href="mailto:info@goldcentury.ae" className="text-sm text-muted-foreground hover:text-primary">
                        info@goldcentury.ae
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gold-gradient">
                      <MapPin className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">Office Address</div>
                      <p className="text-sm text-muted-foreground">
                        Business Bay, Dubai<br />
                        United Arab Emirates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gold-gradient">
                      <Clock className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">Business Hours</div>
                      <p className="text-sm text-muted-foreground">
                        Sunday - Thursday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Friday: Closed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button className="w-full gold-gradient" size="lg" asChild>
                    <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="rounded-lg border border-border bg-card p-8">
                  <h2 className="font-serif text-2xl font-bold">Send us a Message</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24 hours
                  </p>

                  <form className="mt-8 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" placeholder="John Smith" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+971 50 123 4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input id="country" placeholder="United Kingdom" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest">What are you interested in? *</Label>
                      <select 
                        id="interest" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      >
                        <option value="">Select an option</option>
                        <option value="buying">Buying Property</option>
                        <option value="investment">Investment Consultation</option>
                        <option value="golden-visa">Golden Visa Eligibility</option>
                        <option value="market-info">Market Information</option>
                        <option value="property-management">Property Management</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Investment Budget (Optional)</Label>
                      <select 
                        id="budget" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Select a range</option>
                        <option value="under-1m">Under AED 1M</option>
                        <option value="1m-2m">AED 1M - 2M</option>
                        <option value="2m-5m">AED 2M - 5M (Golden Visa)</option>
                        <option value="5m-10m">AED 5M - 10M</option>
                        <option value="over-10m">Over AED 10M</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us about your investment goals, preferred locations, or any questions you have..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        id="consent" 
                        className="mt-1 h-4 w-4 rounded border-input"
                        required
                      />
                      <Label htmlFor="consent" className="text-sm font-normal text-muted-foreground">
                        I agree to receive marketing communications from Gold Century Real Estate about Dubai property investment opportunities
                      </Label>
                    </div>

                    <Button type="submit" size="lg" className="w-full gold-gradient md:w-auto">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Location */}
        <section className="border-t border-border bg-muted/30 py-12">
          <div className="container">
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="grid gap-6 bg-card p-8 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-semibold">Gold Century Real Estate</div>
                    <div className="text-sm text-muted-foreground">
                      Business Bay, Dubai, United Arab Emirates
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Mon - Sat: 9:00 AM - 7:00 PM
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">Phone:</span> +971 50 123 4567
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Email:</span> info@goldcentury.ae
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Consultations:</span> By appointment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-bold">Prefer to Explore First?</h2>
              <p className="mt-4 text-muted-foreground">
                Browse our properties and market insights before reaching out
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/properties">Browse Properties</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/market">Dubai Market Insights</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/chat">Ask AI Assistant</Link>
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
