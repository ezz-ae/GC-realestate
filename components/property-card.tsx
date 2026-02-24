"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={imageSrc}
          alt={property.title}
          fill
          className={imageClass}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
            {property.type === "off-plan" ? "Off-Plan" : property.type === "secondary" ? "Secondary" : "Commercial"}
          </Badge>
          {property.investmentMetrics.goldenVisaEligible && (
            <Badge className="gold-gradient">
              Golden Visa
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold line-clamp-1">{property.title}</h3>
          {property.investmentMetrics.roi && (
            <Badge variant="outline" className="shrink-0 text-xs">
              <TrendingUp className="mr-1 h-3 w-3" />
              {property.investmentMetrics.roi}% ROI
            </Badge>
          )}
        </div>
        
        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{property.location.area}, Dubai</span>
        </div>

        <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            <span>
              {property.specifications.bedrooms === 0
                ? "Studio"
                : `${property.specifications.bedrooms} BD`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.specifications.bathrooms} BA</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{property.specifications.sizeSqft.toLocaleString()} sqft</span>
          </div>
        </div>

        <div className="text-xl font-bold gold-text-gradient">
          {formatPrice(property.price, property.currency)}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="outline" asChild>
          <Link href={`/properties/${property.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
