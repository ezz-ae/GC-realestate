import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DeveloperCard } from "@/components/developer-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getDevelopers } from "@/lib/entrestate"
import Link from "next/link"

export default async function DevelopersPage() {
  const developers = await getDevelopers()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-background to-muted py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 gold-gradient" variant="secondary">
                Developers
              </Badge>
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Dubai Developer Profiles
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Learn about Dubai's leading developers and their track records.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button className="gold-gradient" asChild>
                  <Link href="/contact">Request Developer Insight</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/projects">Browse Projects</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {developers.map((developer) => (
                <DeveloperCard key={developer.id} developer={developer} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
