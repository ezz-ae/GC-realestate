import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BedDouble, Bath, MapPin, Ruler } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
  const prices = project.units.flatMap((unit) => [unit.priceFrom, unit.priceTo]).filter((p) => p > 0)
  if (!prices.length) {
    return "Pricing on request"
  }
  const minPrice = Math.min(...prices)
  return `From ${formatPrice(minPrice)}`
}

const getPrimaryUnit = (project: Project) => {
  if (!project.units || project.units.length === 0) return null
  const pricedUnits = project.units.filter((unit) => Number.isFinite(unit.priceFrom) && unit.priceFrom > 0)
  if (!pricedUnits.length) return project.units[0]
  return pricedUnits.reduce((best, unit) => (unit.priceFrom < best.priceFrom ? unit : best))
}

const formatBedroomLabel = (bedrooms?: number) => {
  if (typeof bedrooms !== "number") return null
  return bedrooms === 0 ? "Studio" : `${bedrooms} Bed`
}

const formatBathLabel = (baths?: number) => {
  if (typeof baths !== "number") return null
  return `${baths} Bath${baths === 1 ? "" : "s"}`
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

  const primaryUnit = getPrimaryUnit(project)
  const bedrooms = formatBedroomLabel(primaryUnit?.bedrooms)
  const baths = formatBathLabel(
    typeof primaryUnit?.baths === "number" ? primaryUnit.baths : primaryUnit?.bathrooms,
  )
  const area = primaryUnit?.sizeFrom ? `${primaryUnit.sizeFrom.toLocaleString()} sq.ft` : null

  return (
    <Link href={`/projects/${project.slug}`} className="group block" prefetch={false}>
      <Card className="overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={project.heroImage}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            <Badge variant={project.status === "selling" ? "default" : "secondary"} className="shadow-sm">
              {statusLabel}
            </Badge>
            {project.investmentHighlights.goldenVisaEligible && (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm border-none">
                Golden Visa
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-5">
          <div className="mb-2">
            <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{project.location.area}</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-primary font-bold text-lg">{getPriceRange(project)}</p>
          </div>

          {(bedrooms || baths || area) && (
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 pt-4 border-t border-border/50">
              {bedrooms && (
                <div className="flex items-center gap-1.5">
                  <BedDouble className="h-4 w-4 text-foreground/70" />
                  <span>{bedrooms}</span>
                </div>
              )}
              {baths && (
                <div className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-foreground/70" />
                  <span>{baths}</span>
                </div>
              )}
              {area && (
                <div className="flex items-center gap-1.5">
                  <Ruler className="h-4 w-4 text-foreground/70" />
                  <span>{area}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between text-sm font-semibold text-foreground">
            <span>View project profile</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
