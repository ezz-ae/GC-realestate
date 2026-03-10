import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get("host") || ""
  const { pathname, search } = url
  const isProd = process.env.NODE_ENV === "production"

  // ── 1. crm.goldcentury.ae → goldcentury.ae/crm ───────────────────
  if (hostname.startsWith("crm.")) {
    url.hostname = "goldcentury.ae"
    url.protocol = "https:"
    if (!pathname.startsWith("/crm")) {
      url.pathname = `/crm${pathname}`
    }
    return NextResponse.redirect(url, { status: 301 })
  }

  // ── 2. HTTP → HTTPS (production only) ────────────────────────────
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")
  if (proto === "http" && isProd) {
    return NextResponse.redirect(`https://${hostname}${pathname}${search}`, { status: 301 })
  }

  // ── 3. www → non-www canonical redirect ──────────────────────────
  // Prevents the browser seeing www and non-www as different SSL origins
  if (hostname.startsWith("www.") && isProd) {
    const canonical = hostname.slice(4)
    return NextResponse.redirect(`https://${canonical}${pathname}${search}`, { status: 301 })
  }

  const res = NextResponse.next()

  // ── 4. Cache-Control headers ─────────────────────────────────────
  const isCrm = pathname.startsWith("/crm")
  const isApi = pathname.startsWith("/api")

  if (!isCrm && !isApi) {
    // Public pages: serve from CDN edge, revalidate every 60s in background
    res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300")
  } else {
    // CRM and API routes: never cache publicly — always fresh
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
  }

  return res
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|manifest.json).*)",
  ],
}
