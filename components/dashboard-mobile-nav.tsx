"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { dashboardNavItems } from "@/components/dashboard-sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardMobileNav({ userRole }: { userRole: string }) {
  const pathname = usePathname()
  const accessRole = userRole === "broker" ? "broker" : "admin"
  const allItems = dashboardNavItems.filter((item) => item.roles.includes(accessRole) && item.href !== "/crm/profile")
  const visibleItems = allItems.slice(0, 4)
  const hiddenItems = allItems.slice(4)

  return (
    <div className="lg:hidden -mx-4 px-4">
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain">
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
        {hiddenItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {hiddenItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
