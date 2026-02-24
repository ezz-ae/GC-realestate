import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingUp, DollarSign, Building2, Users } from "lucide-react"
import Link from "next/link"

const marketStats = [
  {
    label: "Average Price Growth",
    value: "+12.4%",
    change: "vs last year",
    icon: TrendingUp,
    trend: "up"
  },
  {
    label: "Transaction Volume",
    value: "24,500",
    change: "Q4 2025",
    icon: DollarSign,
    trend: "up"
  },
  {
    label: "Active Projects",
    value: "3,500+",
    change: "across Dubai",
    icon: Building2,
    trend: "neutral"
  },
  {
    label: "International Buyers",
    value: "68%",
    change: "of total sales",
    icon: Users,
    trend: "up"
  }
]

export function MarketSnapshot() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
              Dubai Market Snapshot
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time insights from the Dubai real estate market
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link href="/market/trends">
              Full Report
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {marketStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <div className={`rounded-lg p-2 ${
                      stat.trend === 'up' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold gold-text-gradient">
                    {stat.value}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-6 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold">
                  Why Now is the Perfect Time to Invest in Dubai
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Strong market fundamentals, government support, and high rental yields make Dubai a top investment destination
                </p>
              </div>
              <Button className="gold-gradient shrink-0" asChild>
                <Link href="/market/why-dubai">Learn More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
