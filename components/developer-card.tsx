import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"
import type { DeveloperProfile } from "@/lib/types/project"

interface DeveloperCardProps {
  developer: DeveloperProfile
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <Link href={`/developers/${developer.slug}`}>
      <Card className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-foreground">{developer.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {developer.tier ? `${developer.tier} developer` : "Dubai developer"}
                  </div>
                </div>
                <Badge variant="secondary">
                  {developer.awards[0] || "Top Developer"}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {developer.description}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Track record</div>
            <p className="mt-1 text-sm text-foreground">{developer.trackRecord}</p>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="rounded-full border border-border px-2 py-1">
              {developer.tier ? developer.tier : "Core"}
            </span>
            <span className="text-foreground">View profile →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
