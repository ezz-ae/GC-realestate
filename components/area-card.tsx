import Image from "next/image"
import Link from "next/link"
import { MapPin, TrendingUp, Home, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { AreaProfile } from "@/lib/types/project"
import { safeNum, safePercent, safePrice, shouldShow } from "@/lib/utils/safeDisplay"

interface AreaCardProps {
  area: AreaProfile
}

export function AreaCard({ area }: AreaCardProps) {
  const priceLabel = safePrice(area.avgPricePerSqft, "AED")
  const rentalYieldLabel = safePercent(area.rentalYield)
  const propertyCountLabel = shouldShow(area.propertyCount)
    ? `${safeNum(area.propertyCount)}+`
    : "—"
  const investmentScoreLabel = shouldShow(area.investmentScore)
    ? safeNum(area.investmentScore)
    : "—"
  const scoreSuffix = shouldShow(area.investmentScore) ? "/100" : ""
  
  const heroImage = area.heroImage && area.heroImage !== "/logo.png" 
    ? area.heroImage 
    : "/images/dubai-skyline.jpg" // Emirate-level fallback

  const description = area.description || `${area.name} — ${area.propertyCount || 0} active projects, avg yield ${area.rentalYield || 0}%`

  return (
    <Link href={`/areas/${area.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <Image
            src={heroImage}
            alt={area.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = "/images/dubai-skyline.jpg")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute top-3 right-3 z-20">
            {area.freehold && (
              <Badge className="bg-green-500 text-white border-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Freehold
              </Badge>
            )}
          </div>
          <div className="absolute bottom-3 left-3 z-20 pr-3">
            <h3 className="font-serif text-xl font-bold text-white drop-shadow-md">{area.name}</h3>
            <p className="text-xs text-white/90 line-clamp-1 drop-shadow-sm">{description}</p>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Home className="h-4 w-4" />
                <span>Avg. Price</span>
              </div>
              <div className="font-semibold">
                {priceLabel}/sqft
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Rental Yield</span>
              </div>
              <div className="font-semibold text-green-600">{rentalYieldLabel}</div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Projects</span>
              </div>
              <div className="font-semibold">{propertyCountLabel}</div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex flex-wrap gap-1.5">
                {area.lifestyleTags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Market Score</span>
                <div className="flex items-center gap-1">
                  <div className="text-lg font-bold gold-text-gradient">{investmentScoreLabel}</div>
                  {scoreSuffix && (
                    <div className="text-[10px] text-muted-foreground">{scoreSuffix}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
