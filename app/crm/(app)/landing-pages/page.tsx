import Link from "next/link"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSessionUser, isAdminRole } from "@/lib/auth"
import { getLandingPagesForDashboard } from "@/lib/landing-pages"

const formatDate = (value: string | null) => {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-AE")
}

const statusTone = (status: string) => {
  const normalized = status.toLowerCase()
  if (["published", "active", "live"].includes(normalized)) return "bg-emerald-500/10 text-emerald-600"
  if (normalized === "draft") return "bg-amber-500/10 text-amber-600"
  return "bg-muted text-muted-foreground"
}

export default async function CrmLandingPagesPage() {
  const user = await getSessionUser()
  if (!user) redirect("/crm/login")
  if (!isAdminRole(user.role)) {
    return (
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-gradient-to-b from-background to-muted/70 p-6">
          <Badge className="mb-3" variant="secondary">
            Campaign Landing Pages
          </Badge>
          <h1 className="font-serif text-3xl font-bold">Access limited</h1>
          <p className="text-sm text-muted-foreground">Only admins can manage campaign landing pages.</p>
        </section>
      </div>
    )
  }

  const pages = await getLandingPagesForDashboard(200)
  const published = pages.filter((page) => ["published", "active", "live"].includes(page.status.toLowerCase())).length
  const totalViews = pages.reduce((sum, page) => sum + page.pageViews, 0)
  const totalLeads = pages.reduce((sum, page) => sum + page.leadCount, 0)

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-gradient-to-b from-background to-muted/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="mb-3 gold-gradient" variant="secondary">
              Campaign Landing Pages
            </Badge>
            <h1 className="font-serif text-3xl font-bold">LP Campaign Control</h1>
            <p className="text-sm text-muted-foreground">
              Manage project-specific campaign pages under <code>/lp/[slug]</code> with tracking and lead attribution.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/crm/inventory">Open Inventory</Link>
            </Button>
            <Button className="gold-gradient" asChild>
              <Link href="/crm/landing-pages/create">Create Landing Page</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Campaign Pages</p>
            <p className="mt-2 font-serif text-3xl font-bold">{pages.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Published</p>
            <p className="mt-2 font-serif text-3xl font-bold">{published}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Leads / Views</p>
            <p className="mt-2 font-serif text-3xl font-bold">{totalLeads} / {totalViews}</p>
          </CardContent>
        </Card>
      </section>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-10 gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="col-span-3">Campaign</div>
          <div className="col-span-2">Project</div>
          <div>Status</div>
          <div>Views</div>
          <div>Leads</div>
          <div>Window</div>
          <div>Actions</div>
        </div>

        {pages.map((page) => (
          <div key={page.slug} className="grid grid-cols-10 gap-3 border-b border-border px-4 py-4 text-sm last:border-b-0">
            <div className="col-span-3 min-w-0">
              <div className="font-semibold truncate">{page.headline}</div>
              <div className="text-xs text-muted-foreground truncate">/lp/{page.slug}</div>
            </div>
            <div className="col-span-2 text-muted-foreground truncate">{page.projectSlug || "—"}</div>
            <div>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusTone(page.status)}`}>
                {page.status}
              </span>
            </div>
            <div className="text-muted-foreground">{page.pageViews}</div>
            <div className="text-muted-foreground">{page.leadCount}</div>
            <div className="text-xs text-muted-foreground">
              {formatDate(page.publishFrom)} → {formatDate(page.publishTo)}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href={`/lp/${page.slug}`} target="_blank">Open</Link>
              </Button>
            </div>
          </div>
        ))}

        {pages.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No landing pages found in <code>gc_project_landing_pages</code>.
          </div>
        )}
      </div>
    </div>
  )
}
