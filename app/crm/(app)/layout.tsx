import { CrmFooter } from "@/components/crm-footer"
import { CrmHeader } from "@/components/crm-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardMobileNav } from "@/components/dashboard-mobile-nav"
import { getSessionUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()
  if (!user) {
    redirect("/crm/login")
  }

  return (
    <div className="crm-shell flex min-h-screen flex-col">
      <CrmHeader user={user} />
      <main className="flex-1 bg-[linear-gradient(180deg,#faf7f1,transparent_18%),linear-gradient(180deg,#ffffff,#f8f5ef_72%,#ffffff)]">
        <div className="container py-4 md:py-6">
          <DashboardMobileNav userRole={user.role} />
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <DashboardSidebar user={user} />
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <CrmFooter />
    </div>
  )
}
