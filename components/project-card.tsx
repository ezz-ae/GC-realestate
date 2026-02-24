import Image from "next/image"
import Link from "next/link"
import { MapPin, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Project } from "@/lib/types/project"

interface ProjectCardProps {
  project: Project
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value)

const getPriceRange = (project: Project) => {
  const prices = project.units.flatMap((unit) => [unit.priceFrom, unit.priceTo])
  if (!prices.length) {
    return "Pricing on request"
  }
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusLabel =
    project.status === "launching"
      ? "Launching"
      : project.status === "selling"
        ? "Selling"
        : project.status === "completed"
          ? "Completed"
          : "Sold Out"

  return (
    <Card className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={project.heroImage}
          alt={project.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
          <Badge className="bg-black/60 text-white border-white/20">{statusLabel}</Badge>
          {project.investmentHighlights.goldenVisaEligible && (
            <Badge className="gold-gradient">Golden Visa</Badge>
          )}
          {project.location.freehold && <Badge variant="secondary">Freehold</Badge>}
        </div>
      </div>

      <CardContent className="p-5">
        <div className="mb-3">
          <h3 className="font-serif text-xl font-semibold line-clamp-1">{project.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{project.tagline}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4" />
          <span>{project.location.area}</span>
        </div>

        <div className="flex items-center justify-between border-y border-border py-3 text-sm">
          <div className="font-semibold gold-text-gradient">{getPriceRange(project)}</div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            {project.investmentHighlights.expectedROI}% ROI
          </div>
        </div>

        <Button className="mt-4 w-full" variant="outline" asChild>
          <Link href={`/projects/${project.slug}`}>View Project</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
