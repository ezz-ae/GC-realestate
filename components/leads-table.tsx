"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { LeadRecord } from "@/lib/entrestate"

interface LeadsTableProps {
  leads: LeadRecord[]
  isAdmin: boolean
}

export function LeadsTable({ leads, isAdmin }: LeadsTableProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<string | null>(null)

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
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="grid grid-cols-6 gap-4 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <div>Name</div>
        <div>Phone</div>
        <div>Project</div>
        <div>Source</div>
        <div>Assigned</div>
        <div>Actions</div>
      </div>
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="grid grid-cols-6 gap-4 px-4 py-4 text-sm border-b border-border last:border-b-0"
        >
          <div>
            <div className="font-medium">{lead.name}</div>
            <div className="text-xs text-muted-foreground">{lead.email || "—"}</div>
          </div>
          <div className="text-muted-foreground">{lead.phone}</div>
          <div className="text-muted-foreground">{lead.project_slug || "—"}</div>
          <div className="text-muted-foreground">{lead.source || "—"}</div>
          <div>
            {lead.assigned_broker_id ? (
              <Badge variant="secondary">{lead.assigned_broker_id}</Badge>
            ) : (
              <span className="text-xs text-muted-foreground">Unassigned</span>
            )}
          </div>
          <div className="flex items-center gap-2">
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
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
