import { DeveloperCard } from "@/components/developer-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getDevelopers } from "@/lib/entrestate"
import Link from "next/link"

export default async function DevelopersPage() {
  const developers = await getDevelopers()

  return (
    <>
        <section className="border-b border-border bg-gradient-to-b from-background to-muted py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 gold-gradient" variant="secondary">
                Developers
              </Badge>
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Dubai's Top Real Estate Developers
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Explore Dubai's master developers, from legacy builders to innovative new firms shaping the skyline.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {developers.map((developer) => (
                <DeveloperCard key={developer.id} developer={developer} />
              ))}
            </div>
          </div>
        </section>
    </>
  )
}
