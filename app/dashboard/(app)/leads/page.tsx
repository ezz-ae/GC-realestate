import { LeadsTable } from "@/components/leads-table"
import { Badge } from "@/components/ui/badge"
import { getLeads, resolveAccessRole } from "@/lib/entrestate"
import { getSessionUser, isAdminRole } from "@/lib/auth"

export default async function LeadsPage() {
  const user = await getSessionUser()
  const accessRole = resolveAccessRole(user?.role)
  const brokerId = accessRole === "broker" ? user?.id : undefined
  const leads = await getLeads(accessRole, brokerId)
  const isAdmin = isAdminRole(user?.role)

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-gradient-to-b from-background to-muted/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge className="mb-3 gold-gradient" variant="secondary">
              Dashboard
            </Badge>
            <h1 className="font-serif text-3xl font-bold">Leads</h1>
            <p className="text-sm text-muted-foreground">
              {isAdmin
                ? "Admin view: all leads across the platform."
                : `Broker view: leads assigned to ${brokerId || "your ID"}.`}
            </p>
          </div>
        </div>
      </section>

      <section>
        <LeadsTable leads={leads} isAdmin={isAdmin} />
      </section>
    </div>
  )
}
