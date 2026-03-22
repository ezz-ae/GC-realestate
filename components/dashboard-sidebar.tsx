"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  PlusCircle,
  Users,
  BarChart3,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/projects/add", label: "Add Project", icon: PlusCircle },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/profile", label: "Profile", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const role = searchParams.get("role")
  const brokerId = searchParams.get("brokerId")

  const buildHref = (href: string) => {
    const params = new URLSearchParams()
    if (role) params.set("role", role)
    if (brokerId) params.set("brokerId", brokerId)
    const suffix = params.toString()
    return suffix ? `${href}?${suffix}` : href
  }

  return (
    <aside className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Dashboard</div>
        <div className="mt-2 text-sm font-semibold text-foreground">
          {role === "broker" ? "Broker View" : "Admin View"}
        </div>
        {brokerId && (
          <div className="text-xs text-muted-foreground">ID: {brokerId}</div>
        )}
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={buildHref(item.href)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
