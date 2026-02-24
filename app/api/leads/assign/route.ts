import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { leadId, brokerId } = await req.json()
    if (!leadId || !brokerId) {
      return NextResponse.json({ error: "leadId and brokerId are required" }, { status: 400 })
    }

    await query(
      `UPDATE gc_leads SET assigned_broker_id = $1 WHERE id = $2`,
      [brokerId, leadId],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Lead assignment error:", error)
    return NextResponse.json({ error: "Failed to assign lead" }, { status: 500 })
  }
}
