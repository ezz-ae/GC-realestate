import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"
import type { DeveloperProfile } from "@/lib/types/project"

interface DeveloperCardProps {
  developer: DeveloperProfile
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  const showCompleted = shouldShow(developer.completedProjects)
  const showStars = shouldShow(developer.stars)
  const showHonesty = shouldShow(developer.honestyScore)

  return (
    <Link href={`/developers/${developer.slug}`}>
      <Card className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card overflow-hidden">
              {developer.logo && developer.logo !== "/logo.png" ? (
                <img
                  src={developer.logo}
                  alt={developer.name}
                  className="h-full w-full object-contain p-1"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold">
                  {developer.name?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-foreground line-clamp-1">{developer.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">
                    {developer.tier || "Developer"}
                  </div>
                </div>
                {developer.awards?.length > 0 && (
                  <Badge variant="secondary" className="shrink-0">
                    {developer.awards[0]}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {showCompleted && (
              <div className="rounded-lg bg-muted/30 p-2 text-center">
                <div className="text-[10px] uppercase text-muted-foreground">Delivered</div>
                <div className="text-sm font-bold">{safeNum(developer.completedProjects)}</div>
              </div>
            )}
            {showStars && (
              <div className="rounded-lg bg-muted/30 p-2 text-center">
                <div className="text-[10px] uppercase text-muted-foreground">Rating</div>
                <div className="text-sm font-bold">{developer.stars?.toFixed(1)} ★</div>
              </div>
            )}
            {showHonesty && (
              <div className="rounded-lg bg-muted/30 p-2 text-center col-span-2">
                <div className="text-[10px] uppercase text-muted-foreground">Trust Score</div>
                <div className="text-sm font-bold">{safeScore(developer.honestyScore)}</div>
              </div>
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {developer.description}
          </p>

          <div className="mt-4 flex items-center justify-end text-xs font-medium gold-text-gradient">
            View profile →
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
