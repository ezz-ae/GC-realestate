import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Project } from "@/lib/types/project"
import { safeNum, safePercent, safePrice, shouldShow, safeROI, safeScore } from "@/lib/utils/safeDisplay"
import { TrendingUp, BarChart3, Info, MapPin, BedDouble, Bath, Ruler, ArrowRight } from "lucide-react"

interface ProjectCardProps {
  project: Project
}

const getPriceRange = (project: Project) => {
  const units = Array.isArray(project.units) ? project.units : []
  const prices = units.flatMap((unit) => [unit.priceFrom, unit.priceTo]).filter((p) => p > 0)
  if (!prices.length) {
    return "Price on Request"
  }
  const minPrice = Math.min(...prices)
  return `From ${safePrice(minPrice)}`
}

const getPrimaryUnit = (project: Project) => {
  const units = Array.isArray(project.units) ? project.units : []
  if (!units.length) return null
  const pricedUnits = units.filter((unit) => Number.isFinite(unit.priceFrom) && unit.priceFrom > 0)
  if (!pricedUnits.length) return units[0]
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
  const investmentHighlights = project.investmentHighlights || ({} as Project["investmentHighlights"])
  const location = project.location || ({} as Project["location"])
  const projectSlug = project.slug ? `/projects/${project.slug}` : "/projects"
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
  const areaLabel = primaryUnit?.sizeFrom ? `${safeNum(primaryUnit.sizeFrom)} sq.ft` : null

  const showRoi = shouldShow(investmentHighlights.expectedROI)
  const showYield = shouldShow(investmentHighlights.rentalYield)
  const showScore = shouldShow(project.sortScore || investmentHighlights.expectedROI)

  return (
    <Link href={projectSlug} className="group block" prefetch={false}>
      <Card className="overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={project.heroImage || "/logo.png"}
            alt={project.name || "Project"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="absolute top-3 right-3 z-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur shadow-sm p-1 overflow-hidden">
              {project.developer?.logo && project.developer.logo !== "/logo.png" ? (
                <img
                  src={project.developer.logo}
                  alt={project.developer.name}
                  className="h-full w-full object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <div className="text-[10px] font-bold text-primary">{project.developer?.name?.[0] || "GC"}</div>
              )}
            </div>
          </div>
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            <Badge variant={project.status === "selling" ? "default" : "secondary"} className="shadow-sm backdrop-blur-md bg-background/95 border-none">
              {statusLabel}
            </Badge>
            {investmentHighlights.goldenVisaEligible && (
              <Badge className="gold-gradient text-black shadow-sm border-none">
                Golden Visa
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-5">
          <div className="mb-3">
            <h3 className="font-serif text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
              {project.name || "Project"}
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 text-primary/70" />
              <span className="line-clamp-1">{location.area || "Dubai"}</span>
            </div>
          </div>

          <div className="mb-5">
            <p className="gold-text-gradient font-bold text-2xl tracking-tight">{getPriceRange(project)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {showRoi && (
              <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2 border border-border/50">
                <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                <div className="text-[10px] font-medium leading-tight">
                  <div className="text-muted-foreground uppercase tracking-tighter">Est. Breakeven</div>
                  <div className="font-bold">{safeROI(investmentHighlights.expectedROI)}</div>
                </div>
              </div>
            )}
            {showYield && (
              <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2 border border-border/50">
                <BarChart3 className="h-4 w-4 text-primary shrink-0" />
                <div className="text-[10px] font-medium leading-tight">
                  <div className="text-muted-foreground uppercase tracking-tighter">Gross Yield</div>
                  <div className="font-bold">{safePercent(investmentHighlights.rentalYield)}</div>
                </div>
              </div>
            )}
          </div>

          {(bedrooms || baths || areaLabel) && (
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-6 pt-4 border-t border-border/50">
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
              {areaLabel && (
                <div className="flex items-center gap-1.5">
                  <Ruler className="h-4 w-4 text-foreground/70" />
                  <span>{areaLabel}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 group-hover:text-primary transition-colors">
            <span>Explore Development</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
