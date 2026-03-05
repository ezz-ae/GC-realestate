import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { query } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ensureLeadSchema = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS gc_leads (
      id text PRIMARY KEY,
      name text,
      phone text,
      email text,
      source text,
      project_slug text,
      message text,
      status text DEFAULT 'new',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `)

  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS landing_slug text`)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS budget text`)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS utm_source text`)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS utm_medium text`)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS utm_campaign text`)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS utm_term text`)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS utm_content text`)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS utm_id text`)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS referrer text`)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS device jsonb`)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS geo_country text`)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS geo_region text`)
  await query(`ALTER TABLE gc_leads ADD COLUMN IF NOT EXISTS geo_city text`)
}

const toText = (value: unknown) => (typeof value === "string" ? value.trim() : "")

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const name = toText(body.name)
    const phone = toText(body.phone)
    const email = toText(body.email)
    const budget = toText(body.budget)
    const message = toText(body.message)
    const source = toText(body.source) || `lp:${toText(body.landingSlug)}`
    const projectSlug = toText(body.projectSlug)
    const landingSlug = toText(body.landingSlug)

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required." }, { status: 400 })
    }

    const utm = (body.utm && typeof body.utm === "object" ? body.utm : {}) as Record<string, unknown>
    const device = body.device && typeof body.device === "object" ? body.device : {}

    await ensureLeadSchema()

    const leadId = randomUUID()
    await query(
      `INSERT INTO gc_leads (
        id, name, phone, email, source, project_slug, landing_slug, message, budget, status,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content, utm_id,
        referrer, device, geo_country, geo_region, geo_city, created_at, updated_at
      )
      VALUES (
        $1, $2, $3, NULLIF($4, ''), $5, NULLIF($6, ''), NULLIF($7, ''), NULLIF($8, ''), NULLIF($9, ''), 'new',
        NULLIF($10, ''), NULLIF($11, ''), NULLIF($12, ''), NULLIF($13, ''), NULLIF($14, ''), NULLIF($15, ''),
        NULLIF($16, ''), $17::jsonb, NULLIF($18, ''), NULLIF($19, ''), NULLIF($20, ''), now(), now()
      )`,
      [
        leadId,
        name,
        phone,
        email,
        source,
        projectSlug,
        landingSlug,
        message,
        budget,
        toText(utm.source),
        toText(utm.medium),
        toText(utm.campaign),
        toText(utm.term),
        toText(utm.content),
        toText(utm.id),
        toText(body.referrer),
        JSON.stringify(device),
        toText(req.headers.get("x-vercel-ip-country")),
        toText(req.headers.get("x-vercel-ip-country-region")),
        toText(req.headers.get("x-vercel-ip-city")),
      ],
    )

    return NextResponse.json({ ok: true, id: leadId })
  } catch (error) {
    console.error("[lp-leads] create error", error)
    return NextResponse.json({ error: "Unable to capture lead" }, { status: 500 })
  }
}
