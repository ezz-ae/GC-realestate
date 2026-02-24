"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, BedDouble, Bath, Maximize, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Property } from "@/lib/types/project"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, currency: Property["currency"]) => {
    const locale = currency === "AED" ? "en-AE" : "en-US"
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const imageSrc = property.images?.[0] || "/logo.png"
  const imageClass = property.images?.[0]
    ? "object-cover transition-transform group-hover:scale-105"
    : "object-contain bg-muted p-6"
  const bedLabel =
    property.specifications.bedrooms === 0
      ? "Studio"
      : `${property.specifications.bedrooms} Bed`
  const bathLabel = `${property.specifications.bathrooms} Bath${
    property.specifications.bathrooms === 1 ? "" : "s"
  }`

  return (
    <Link href={`/properties/${property.slug}`} className="group block" prefetch={false}>
      <Card className="overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={imageSrc}
          alt={property.title}
          fill
          className={imageClass}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant="secondary" className="bg-background/95 backdrop-blur-md shadow-sm border-none">
            {property.type === "off-plan" ? "Off-Plan" : property.type === "secondary" ? "Secondary" : "Commercial"}
          </Badge>
          {property.investmentMetrics.goldenVisaEligible && (
            <Badge className="gold-gradient border-none shadow-sm">
              Golden Visa
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-serif text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
          {property.investmentMetrics.roi && (
            <Badge variant="outline" className="shrink-0 text-[10px] h-5 border-primary/20 bg-primary/5 text-primary">
              <TrendingUp className="mr-1 h-3 w-3" />
              {property.investmentMetrics.roi}% ROI
            </Badge>
          )}
        </div>
        
        <div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <MapPin className="h-3 w-3 text-primary/70" />
          <span className="line-clamp-1">{property.location.area}, Dubai</span>
        </div>

        <div className="mb-5 flex items-center gap-4 text-xs text-muted-foreground border-y border-border/50 py-3">
          <div className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-foreground/70" />
            <span>{bedLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-foreground/70" />
            <span>{bathLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-foreground/70" />
            <span>{property.specifications.sizeSqft.toLocaleString()} sqft</span>
          </div>
        </div>

        <div className="text-2xl font-bold gold-text-gradient tracking-tight">
          {formatPrice(property.price, property.currency)}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <div className="w-full rounded-full border border-primary/20 bg-primary/5 px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
          Explore Unit
        </div>
      </CardFooter>
    </Card>
    </Link>
  )
}
