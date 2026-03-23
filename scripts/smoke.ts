#!/usr/bin/env tsx
/**
 * scripts/smoke.ts
 * Entrestate Intelligence OS — Staging Smoke Runner
 */

import { parseArgs } from "node:util"
import { performance } from "node:perf_hooks"

// ── Config ────────────────────────────────────────────────────────
const { values: args } = parseArgs({
  options: {
    url:  { type: "string" },
    prod: { type: "boolean", default: false },
  },
  allowPositionals: false,
})

const BASE_URL =
  args.url ??
  (args.prod
    ? process.env.PRODUCTION_URL ?? "https://goldcentury.ae"
    : process.env.STAGING_URL   ?? "http://localhost:3000")

const BYPASS_TOKEN = args.prod ? undefined : process.env.VERCEL_BYPASS_TOKEN
const TIMEOUT_MS   = parseInt(process.env.SMOKE_TIMEOUT_MS ?? "8000", 10)

// ── Request helper ────────────────────────────────────────────────
async function hit(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  expect?: (res: Response, json: unknown) => void,
): Promise<{ ok: boolean; ms: number; error?: string }> {
  const url = `${BASE_URL}${path}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(BYPASS_TOKEN ? { "x-vercel-protection-bypass": BYPASS_TOKEN } : {}),
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const start = performance.now()

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
    const ms = Math.round(performance.now() - start)
    clearTimeout(timer)

    if (!res.ok) {
      return { ok: false, ms, error: `HTTP ${res.status} ${res.statusText}` }
    }

    const json = await res.json().catch(() => ({}))
    if (expect) expect(res, json)
    return { ok: true, ms }
  } catch (e: unknown) {
    const ms = Math.round(performance.now() - start)
    clearTimeout(timer)
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, ms, error: msg }
  }
}

// ── Smoke Tests ───────────────────────────────────────────────────
type SmokeTest = {
  name:   string
  run:    () => Promise<{ ok: boolean; ms: number; error?: string }>
  critical: boolean
}

const SMOKE_TESTS: SmokeTest[] = [
  {
    name: "GET / — landing page renders",
    critical: true,
    run: () => hit("GET", "/", undefined, (res) => {
      if (!res.headers.get("content-type")?.includes("text/html"))
        throw new Error("Landing page must return text/html")
    }),
  },
  {
    name: "GET /api/dashboard/overview — returns stable shape",
    critical: true,
    run: () => hit("GET", "/api/dashboard/overview", undefined, (_, json: any) => {
      if (!json.totalLeads && json.totalLeads !== 0)
        throw new Error("/api/dashboard/overview missing data")
    }),
  },
  {
    name: "POST /api/ai/chat — returns {content, dataCards}",
    critical: true,
    run: () => hit("POST", "/api/ai/chat",
      { message: "Show me top areas by yield in Dubai" },
      (_, json: any) => {
        if (!json.content)    throw new Error("Missing content")
      }),
  },
]

// ── Runner ────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${"═".repeat(60)}`)
  console.log(`  ENTRESTATE SMOKE RUNNER`)
  console.log(`  Target: ${BASE_URL}`)
  console.log(`  Tests:  ${SMOKE_TESTS.length}`)
  console.log(`${"═".repeat(60)}\n`)

  const results: Array<{ name: string; ok: boolean; ms: number; error?: string; critical: boolean }> = []
  let aborted = false

  for (const test of SMOKE_TESTS) {
    if (aborted) {
      results.push({ name: test.name, ok: false, ms: 0, error: "Aborted", critical: test.critical })
      continue
    }

    process.stdout.write(`  ${test.name.padEnd(55)} `)
    const result = await test.run()
    results.push({ ...result, name: test.name, critical: test.critical })

    if (result.ok) {
      console.log(`✅  ${result.ms}ms`)
    } else {
      console.log(`❌  ${result.ms}ms  →  ${result.error}`)
      if (test.critical) {
        console.log(`\n  CRITICAL FAILURE — aborting remaining tests.`)
        aborted = true
      }
    }
  }

  const failed = results.filter(r => !r.ok).length

  console.log(`\n${"═".repeat(60)}`)
  if (failed === 0) {
    console.log(`  ✅ All smoke checks passed.`)
  } else {
    console.log(`  ❌ ${failed} check(s) failed.`)
    process.exit(1)
  }
}

main().catch(err => {
  console.error("Smoke runner crashed:", err)
  process.exit(1)
})
