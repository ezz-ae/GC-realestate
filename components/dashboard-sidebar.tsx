"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  PlusCircle,
  Users,
  BarChart3,
  Settings,
  Rocket,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/crm/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/crm/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/crm/inventory", label: "Inventory", icon: FolderKanban },
  { href: "/crm/projects/add", label: "Add Project", icon: PlusCircle },
  { href: "/crm/landing-pages", label: "Landing Pages", icon: Rocket },
  { href: "/crm/leads", label: "Leads", icon: Users },
  { href: "/crm/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/crm/profile", label: "Profile", icon: Settings },
]

export function DashboardSidebar({
  user,
}: {
  user: { id: string; name: string; role: string }
}) {
  const pathname = usePathname()

  return (
    <aside className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-6 sticky top-24 h-fit">
      <div className="mb-8 px-2">
        <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary mb-2">Access Level</div>
        <div className="font-serif text-xl font-bold text-foreground">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground font-medium">ID: {user.id.slice(0, 8)}...</div>
      </div>
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
