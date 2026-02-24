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
    <div className="overflow-auto rounded-lg border border-border bg-card">
      <div className="grid min-w-[980px] grid-cols-9 gap-4 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <div className="col-span-2">Lead</div>
        <div>Status</div>
        <div>Priority</div>
        <div>Project</div>
        <div>Source</div>
        <div>Assigned</div>
        <div>Last Contact</div>
        <div>Actions</div>
      </div>
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="grid min-w-[980px] grid-cols-9 gap-4 px-4 py-4 text-sm border-b border-border last:border-b-0"
        >
          <div className="col-span-2">
            <div className="font-medium">{lead.name}</div>
            <div className="text-xs text-muted-foreground">{lead.email || "—"}</div>
          </div>
          <div>
            <Badge variant="outline" className={statusClass(lead.status)}>
              {lead.status || "new"}
            </Badge>
          </div>
          <div>
            <Badge variant="outline" className={priorityClass(lead.priority)}>
              {lead.priority || "cold"}
            </Badge>
          </div>
          <div className="text-muted-foreground">{lead.project_slug || "—"}</div>
          <div className="text-muted-foreground">{lead.source || "—"}</div>
          <div>
            {lead.assigned_broker_id ? (
              <Badge variant="secondary">{lead.assigned_broker_id}</Badge>
            ) : (
              <span className="text-xs text-muted-foreground">Unassigned</span>
            )}
          </div>
          <div className="text-muted-foreground">
            {formatDate(lead.last_contact_at || lead.created_at)}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/dashboard/leads/${lead.id}`}>View</Link>
            </Button>
            {isAdmin ? (
              <>
                <Input
                  placeholder="Broker ID"
                  value={assignments[lead.id] || ""}
                  onChange={(e) => setAssignments((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                  className="h-8 w-28"
                />
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loading === lead.id || !assignments[lead.id]}
                  onClick={() => handleAssign(lead.id)}
                >
                  {loading === lead.id ? "Assigning..." : "Assign"}
                </Button>
              </>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}
