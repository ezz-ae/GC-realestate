import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, MessageCircle, Instagram } from "lucide-react"
import Link from "next/link"
import { ContactEnquiryForm } from "@/components/contact-enquiry-form"

export const metadata = {
  title: "Contact Us | Gold Century Real Estate",
  description: "Get in touch with Gold Century Real Estate - Schedule a consultation, ask questions, or visit our Dubai office.",
}

export default function ContactPage() {
  return (
    <>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-16 md:py-24 border-b">
          <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#a1a1aa_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-6xl">
                Get in <span className="gold-text-gradient">Touch</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Expert guidance for Dubai real estate. Our team helps you make data-driven investment decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-12 md:py-24">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-[1fr,1.8fr]">
              {/* Contact Info */}
              <div className="space-y-8 order-2 lg:order-1">
                <div>
                  <h2 className="font-serif text-3xl font-bold">Contact Details</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Direct access to our advisory team.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gold-gradient">
                      <Phone className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Call Center</div>
                      <a href="tel:+971526326541" className="text-base text-muted-foreground hover:text-primary transition-colors">
                        +971526326541
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card shadow-sm border-primary/20 bg-primary/5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500 shadow-lg shadow-green-500/20">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">WhatsApp</div>
                      <a href="https://wa.me/971526326541" className="text-base text-muted-foreground hover:text-green-600 transition-colors">
                        Available 24/7
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gold-gradient">
                      <Mail className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Email Support</div>
                      <a href="mailto:hello@goldcentury.ae" className="text-base text-muted-foreground hover:text-primary transition-colors">
                        hello@goldcentury.ae
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gold-gradient">
                      <MapPin className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Headquarters</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Business Bay, Dubai, UAE
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gold-gradient">
                      <Instagram className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Instagram</div>
                      <a
                        href="https://www.instagram.com/goldcentury.ae/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-muted-foreground hover:text-primary transition-colors"
                      >
                        @goldcentury.ae
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border bg-muted/40 backdrop-blur-sm">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">Support Hours</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mon - Sat</span>
                      <span className="text-foreground font-semibold">9:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="text-foreground font-semibold">Online Only</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="order-1 lg:order-2">
                <div className="rounded-[2rem] border border-border bg-card p-6 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                  
                  <h2 className="font-serif text-3xl md:text-4xl font-bold">Send Enquiry</h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    Fill out the form and a senior investment consultant will contact you with a curated portfolio.
                  </p>

                  <ContactEnquiryForm />
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
                      <span className="font-medium text-foreground">Phone:</span> +971526326541
                    </div>
                  <div>
                    <span className="font-medium text-foreground">Email:</span> hello@goldcentury.ae
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Consultations:</span> By appointment
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Instagram:</span>{" "}
                    <a
                      href="https://www.instagram.com/goldcentury.ae/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      @goldcentury.ae
                    </a>
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
    </>
  )
}
