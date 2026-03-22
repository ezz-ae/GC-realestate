import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"
import type { DeveloperProfile } from "@/lib/types/project"
import { safeNum, safeScore, shouldShow } from "@/lib/utils/safeDisplay"

interface DeveloperCardProps {
  developer: DeveloperProfile
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  const showCompleted = shouldShow(developer.completedProjects)
  const showStars = shouldShow(developer.stars)
  const showHonesty = shouldShow(developer.honestyScore)

  return (
    <Link href={`/developers/${developer.slug}`}>
      <Card className="group overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 shadow-sm shrink-0 overflow-hidden">
              {developer.logo && developer.logo !== "/logo.png" ? (
                <img
                  src={developer.logo}
                  alt={developer.name}
                  className="h-full w-full object-contain p-2"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <div className="text-2xl font-serif font-bold text-primary">{developer.name?.[0] || "D"}</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors truncate">{developer.name}</div>
                  <div className="mt-1 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                    {developer.tier || "UAE Developer"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {showCompleted && (
              <div className="rounded-xl bg-muted/30 p-2.5 text-center">
                <div className="text-[9px] uppercase font-bold tracking-tighter text-muted-foreground mb-0.5">Delivered</div>
                <div className="text-sm font-bold">{safeNum(developer.completedProjects)}</div>
              </div>
            )}
            {showStars && (
              <div className="rounded-xl bg-muted/30 p-2.5 text-center">
                <div className="text-[9px] uppercase font-bold tracking-tighter text-muted-foreground mb-0.5">Rating</div>
                <div className="text-sm font-bold">{developer.stars?.toFixed(1)} ★</div>
              </div>
            )}
            {showHonesty && (
              <div className="rounded-xl bg-muted/30 p-2.5 text-center col-span-2">
                <div className="text-[9px] uppercase font-bold tracking-tighter text-muted-foreground mb-0.5">Trust Score</div>
                <div className="text-sm font-bold gold-text-gradient">{safeScore(developer.honestyScore)}</div>
              </div>
            )}
          </div>

          <p className="mt-5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {developer.description}
          </p>

          <div className="mt-6 rounded-2xl border border-border/50 bg-muted/40 p-4">
            <div className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1.5">Elite Track Record</div>
            <p className="text-xs text-foreground font-medium line-clamp-2 leading-relaxed">{developer.trackRecord}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Verified Partner
            </span>
            <span>Profile →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
