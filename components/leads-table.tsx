"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { LeadRecord } from "@/lib/entrestate"

interface LeadsTableProps {
  leads: LeadRecord[]
  isAdmin: boolean
}

export function LeadsTable({ leads, isAdmin }: LeadsTableProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<string | null>(null)

  const formatDate = (value?: string | null) => {
    if (!value) return "—"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "—"
    return date.toLocaleDateString()
  }

  const statusClass = (status?: string | null) => {
    switch (status) {
      case "new":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400"
      case "contacted":
        return "border-amber-500/30 bg-amber-500/10 text-amber-400"
      case "qualified":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      case "viewing":
        return "border-purple-500/30 bg-purple-500/10 text-purple-400"
      case "negotiating":
        return "border-orange-500/30 bg-orange-500/10 text-orange-400"
      case "closed":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      case "lost":
        return "border-rose-500/30 bg-rose-500/10 text-rose-400"
      default:
        return "border-muted-foreground/30 bg-muted/40 text-muted-foreground"
    }
  }

  const priorityClass = (priority?: string | null) => {
    switch (priority) {
      case "hot":
        return "border-rose-500/30 bg-rose-500/10 text-rose-400"
      case "warm":
        return "border-amber-500/30 bg-amber-500/10 text-amber-400"
      default:
        return "border-muted-foreground/30 bg-muted/40 text-muted-foreground"
    }
  }

  const handleAssign = async (leadId: string) => {
    const brokerId = assignments[leadId]
    if (!brokerId) return
    setLoading(leadId)
    try {
      await fetch("/api/leads/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, brokerId }),
      })
      window.location.reload()
    } finally {
      setLoading(null)
    }
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No leads yet.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      <div className="overflow-x-auto">
        <div className="grid min-w-[1100px] grid-cols-10 gap-4 border-b border-border/60 bg-muted/30 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          <div className="col-span-2">Lead Information</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-1 text-center">Project</div>
          <div className="col-span-1 text-center">Source</div>
          <div className="col-span-1 text-center">Assigned</div>
          <div className="col-span-1 text-right">Activity</div>
          <div className="col-span-2 text-right">Management</div>
        </div>
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="grid min-w-[1100px] grid-cols-10 gap-4 px-6 py-5 text-sm border-b border-border/40 last:border-b-0 hover:bg-muted/10 transition-colors items-center"
          >
            <div className="col-span-2">
              <div className="font-serif text-base font-bold text-foreground">{lead.name}</div>
              <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{lead.email || "No email"}</div>
            </div>
            <div className="col-span-1">
              <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-tight", statusClass(lead.status))}>
                {lead.status || "new"}
              </Badge>
            </div>
            <div className="col-span-1">
              <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-tight", priorityClass(lead.priority))}>
                {lead.priority || "cold"}
              </Badge>
            </div>
            <div className="col-span-1 text-center font-medium text-xs truncate" title={lead.project_slug || ""}>
              {lead.project_slug || "—"}
            </div>
            <div className="col-span-1 text-center text-xs text-muted-foreground">
              {lead.source || "Web"}
            </div>
            <div className="col-span-1 text-center">
              {lead.assigned_broker_id ? (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-[10px] font-bold">
                  {lead.assigned_broker_id.slice(0, 6)}
                </div>
              ) : (
                <span className="text-[10px] font-bold text-muted-foreground/50 italic">Open</span>
              )}
            </div>
            <div className="col-span-1 text-right text-xs text-muted-foreground whitespace-nowrap">
              {formatDate(lead.last_contact_at || lead.created_at)}
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2">
              <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-wider hover:bg-primary/5 hover:text-primary" asChild>
                <Link href={`/crm/leads/${lead.id}`}>View Details</Link>
              </Button>
              {isAdmin && !lead.assigned_broker_id ? (
                <div className="flex gap-1 animate-in fade-in slide-in-from-right-2 duration-300">
                  <Input
                    placeholder="ID"
                    value={assignments[lead.id] || ""}
                    onChange={(e) => setAssignments((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                    className="h-8 w-16 text-[10px] font-bold uppercase px-2"
                  />
                  <Button
                    size="sm"
                    className="h-8 gold-gradient text-[10px] font-bold px-3 shadow-sm"
                    disabled={loading === lead.id || !assignments[lead.id]}
                    onClick={() => handleAssign(lead.id)}
                  >
                    {loading === lead.id ? "..." : "Assign"}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
