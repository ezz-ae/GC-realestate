"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, BedDouble, Bath, Maximize, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Property } from "@/lib/types/project"
import { safeNum, safePercent, safePrice, shouldShow } from "@/lib/utils/safeDisplay"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const showRoi = shouldShow(property.investmentMetrics.roi)
  const showYield = shouldShow(property.investmentMetrics.rentalYield)
  const showScore = shouldShow(property.investmentMetrics.roi || property.investmentMetrics.rentalYield)
  
  const sizeLabel = shouldShow(property.specifications.sizeSqft)
    ? `${safeNum(property.specifications.sizeSqft)} sqft`
    : "Size TBA"
  const bathroomLabel = shouldShow(property.specifications.bathrooms)
    ? `${safeNum(property.specifications.bathrooms)} BA`
    : "Bathrooms TBA"

  const imageSrc = property.images?.[0] || "/logo.png"
  const imageClass = property.images?.[0]
    ? "object-cover transition-transform group-hover:scale-105"
    : "object-contain bg-muted p-6"

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg border-border/50">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={imageSrc}
          alt={property.title}
          fill
          className={imageClass}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm shadow-sm">
            {property.type === "off-plan" ? "Off-Plan" : property.type === "secondary" ? "Secondary" : "Commercial"}
          </Badge>
          {property.investmentMetrics.goldenVisaEligible && (
            <Badge className="gold-gradient shadow-sm">
              Golden Visa
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="text-lg font-bold text-white drop-shadow-md">
            {safePrice(property.price, property.currency)}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3 text-primary" />
            <span className="line-clamp-1">{property.location.area || "Dubai"}, {property.location.city}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {showRoi && (
            <div className="flex items-center gap-1.5 rounded bg-muted/50 p-1.5 border border-border/40">
              <TrendingUp className="h-3 w-3 text-primary shrink-0" />
              <div className="text-[9px] font-bold leading-none">
                <div className="text-muted-foreground uppercase tracking-tighter mb-0.5">ROI</div>
                <div>{safeROI(property.investmentMetrics.roi)}</div>
              </div>
            </div>
          )}
          {showYield && (
            <div className="flex items-center gap-1.5 rounded bg-muted/50 p-1.5 border border-border/40">
              <BarChart3 className="h-3 w-3 text-primary shrink-0" />
              <div className="text-[9px] font-bold leading-none">
                <div className="text-muted-foreground uppercase tracking-tighter mb-0.5">Yield</div>
                <div>{safePercent(property.investmentMetrics.rentalYield)}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
          <div className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" />
            <span>{property.specifications.bedrooms === 0 ? "Studio" : `${property.specifications.bedrooms} BR`}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            <span>{bathroomLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="h-3.5 w-3.5" />
            <span>{sizeLabel}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full h-10 gold-gradient" asChild>
          <Link href={`/properties/${property.slug}`}>Investment Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
