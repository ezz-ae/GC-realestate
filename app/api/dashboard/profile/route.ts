import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { upsertUserProfile } from "@/lib/entrestate"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = String(body?.name || "").trim()
    const email = String(body?.email || "").trim().toLowerCase()
    const role = String(body?.role || "broker").trim()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 })
    }

    const record = await upsertUserProfile({
      id: body?.id || randomUUID(),
      name,
      email,
      role,
    })

    return NextResponse.json({ profile: record })
  } catch (error) {
    console.error("[v0] Profile update error:", error)
    return NextResponse.json({ error: "Failed to save profile." }, { status: 500 })
  }
}
