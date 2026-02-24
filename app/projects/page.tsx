import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getProjectsForGrid } from "@/lib/entrestate"
import Link from "next/link"

export default async function ProjectsPage() {
  const projects = await getProjectsForGrid(24)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-background to-muted py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 gold-gradient" variant="secondary">
                Projects
              </Badge>
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Dubai Projects & Communities
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Explore master communities and developments built for investment performance and lifestyle.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button className="gold-gradient" asChild>
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/chat">Ask AI About Projects</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold">Featured Developments</h2>
                <p className="text-sm text-muted-foreground">
                  {projects.length} curated projects across Dubai
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
