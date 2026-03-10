"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { dashboardNavItems } from "@/components/dashboard-sidebar"
import { cn } from "@/lib/utils"

export function DashboardMobileNav({ userRole }: { userRole: string }) {
  const pathname = usePathname()
  const accessRole = userRole === "broker" ? "broker" : "admin"
  const visibleItems = dashboardNavItems.filter((item) => item.roles.includes(accessRole) && item.href !== "/crm/profile")

  return (
    <div className="lg:hidden -mx-4 px-4">
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "snap-start whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold touch-manipulation",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
