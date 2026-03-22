import Image from "next/image"
import Link from "next/link"
import { MapPin, TrendingUp, BarChart3, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Project } from "@/lib/types/project"
import { safeNum, safePercent, safePrice, shouldShow, safeROI, safeScore } from "@/lib/utils/safeDisplay"

interface ProjectCardProps {
  project: Project
}

const getPriceRange = (project: Project) => {
  const prices = (project.units || [])
    .flatMap((unit) => [unit.priceFrom, unit.priceTo])
    .filter((value): value is number => shouldShow(value))

  if (!prices.length) {
    return "Price on Request"
  }

  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  if (minPrice === maxPrice) {
    return safePrice(minPrice)
  }

  return `${safePrice(minPrice)} - ${safePrice(maxPrice)}`
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

  const showRoi = shouldShow(project.investmentHighlights.expectedROI)
  const showYield = shouldShow(project.investmentHighlights.rentalYield)
  const showScore = shouldShow(project.sortScore || project.investmentHighlights.expectedROI)

  return (
    <Card className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={project.heroImage || "/logo.png"}
          alt={project.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Developer Logo Overlay (Codex 2.11) */}
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

        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
          <Badge className="bg-black/60 text-white border-white/20 backdrop-blur-sm">{statusLabel}</Badge>
          {project.investmentHighlights.goldenVisaEligible && (
            <Badge className="gold-gradient">Golden Visa</Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
          <div className="text-sm font-bold text-white drop-shadow-md">{getPriceRange(project)}</div>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="mb-3">
          <h3 className="font-serif text-xl font-bold tracking-tight line-clamp-1">{project.name}</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3 text-primary" />
            <span className="line-clamp-1">{project.location.area || "Dubai Masterplan"}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {showRoi && (
            <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2 border border-border/50">
              <TrendingUp className="h-4 w-4 text-primary shrink-0" />
              <div className="text-[10px] font-medium leading-tight">
                <div className="text-muted-foreground uppercase tracking-tighter">ROI</div>
                <div className="font-bold">{safeROI(project.investmentHighlights.expectedROI)}</div>
              </div>
            </div>
          )}
          {showYield && (
            <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2 border border-border/50">
              <BarChart3 className="h-4 w-4 text-primary shrink-0" />
              <div className="text-[10px] font-medium leading-tight">
                <div className="text-muted-foreground uppercase tracking-tighter">Yield</div>
                <div className="font-bold">{safePercent(project.investmentHighlights.rentalYield)}</div>
              </div>
            </div>
          )}
          {showScore && (
            <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2 border border-border/50 col-span-2">
              <Info className="h-4 w-4 text-primary shrink-0" />
              <div className="text-[10px] font-medium leading-tight">
                <div className="text-muted-foreground uppercase tracking-tighter">Investment Score</div>
                <div className="font-bold">{safeScore(project.sortScore || project.investmentHighlights.expectedROI)}</div>
              </div>
            </div>
          )}
        </div>

        <Button className="w-full gold-gradient" asChild>
          <Link href={`/projects/${project.slug}`}>Investment Case</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
