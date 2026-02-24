import Image from "next/image"
import Link from "next/link"
import { MapPin, TrendingUp, Home, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { AreaProfile } from "@/lib/types/project"

interface AreaCardProps {
  area: AreaProfile
}

export function AreaCard({ area }: AreaCardProps) {
  return (
    <Link href={`/areas/${area.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <Image
            src={area.heroImage}
            alt={area.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
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
          <div className="absolute bottom-3 left-3 z-20">
            <h3 className="font-serif text-xl font-bold text-white">{area.name}</h3>
            <p className="text-sm text-white/90">{area.description}</p>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Home className="h-4 w-4" />
                <span>Avg. Price</span>
              </div>
              <div className="font-semibold">AED {area.avgPricePerSqft}/sqft</div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Rental Yield</span>
              </div>
              <div className="font-semibold text-green-600">{area.rentalYield}%</div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Properties</span>
              </div>
              <div className="font-semibold">{area.propertyCount}+</div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex flex-wrap gap-1.5">
                {area.lifestyleTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Investment Score</span>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold gold-text-gradient">{area.investmentScore}</div>
                  <div className="text-xs text-muted-foreground">/10</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
