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
    <Link href={`/areas/${area.slug.trim().toLowerCase()}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-border bg-card">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <Image
            src={area.image}
            alt={area.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 right-3 z-20 flex flex-wrap gap-2">
            {area.freehold && (
              <Badge className="bg-green-600 text-white border-0 shadow-md">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                Freehold
              </Badge>
            )}
            <Badge variant="secondary" className="backdrop-blur bg-white/70 text-black">
              {area.propertyCount}+ listings
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 z-20">
            <h3 className="font-serif text-2xl font-bold text-white drop-shadow-lg">{area.name}</h3>
          </div>
        </div>
        <CardContent className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {area.description}
          </p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Home className="h-3.5 w-3.5" />
                <span>Avg. Price</span>
              </div>
              <div className="font-semibold">AED {area.avgPricePerSqft.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Yield</span>
              </div>
              <div className="font-semibold text-green-600">{area.rentalYield}%</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>Score</span>
              </div>
              <div className="font-semibold gold-text-gradient">{area.investmentScore}/10</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
