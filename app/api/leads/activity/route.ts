import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { query } from "@/lib/db"
import { ensureLeadActivityTable, ensureLeadsTable, type LeadRecord } from "@/lib/entrestate"
import { getSessionUser, isAdminRole, logActivity } from "@/lib/auth"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const body = await req.json()
    const leadId = String(body?.leadId || "").trim()
    const status = body?.status ? String(body.status).trim() : null
    const note = body?.note ? String(body.note).trim() : null
    const markContacted = Boolean(body?.markContacted)

    if (!leadId) {
      return NextResponse.json({ error: "Lead ID is required." }, { status: 400 })
    }

    await ensureLeadsTable()
    await ensureLeadActivityTable()

    const leads = await query<LeadRecord>(
      `SELECT id, assigned_broker_id FROM gc_leads WHERE id = $1 LIMIT 1`,
      [leadId],
    )
    const lead = leads[0]
    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 })
    }

    if (!isAdminRole(user.role) && lead.assigned_broker_id !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 })
    }

    if (status || markContacted) {
      const updates: string[] = []
      const params: Array<string | number> = []
      if (status) {
        params.push(status)
        updates.push(`status = $${params.length}`)
      }
      if (markContacted) {
        updates.push("last_contact_at = now()")
      }
      params.push(leadId)
      await query(
        `UPDATE gc_leads SET ${updates.join(", ")} WHERE id = $${params.length}`,
        params,
      )
    }

    if (note || status) {
      const description =
        note || (status ? `Status updated to ${status}` : null)
      await query(
        `INSERT INTO gc_lead_activity (id, lead_id, activity_type, description, created_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          randomUUID(),
          leadId,
          note ? "note" : "status_update",
          description,
          user.id,
        ],
      )
    }

    await logActivity("lead_updated", user.id, { leadId, status })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Lead activity error:", error)
    return NextResponse.json({ error: "Failed to update lead." }, { status: 500 })
  }
}
