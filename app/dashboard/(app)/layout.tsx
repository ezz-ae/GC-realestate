import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { getSessionUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()
  if (!user) {
    redirect("/dashboard/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-8">
          <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
            <DashboardSidebar user={user} />
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
