import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get("host") || ""
  const { pathname } = url

  // crm.goldcentury.ae → goldcentury.ae/crm
  if (hostname.startsWith("crm.")) {
    url.hostname = "goldcentury.ae"
    url.protocol = "https:"
    if (!pathname.startsWith("/crm")) {
      url.pathname = `/crm${pathname}`
    }
    return NextResponse.redirect(url, { status: 301 })
  }

  const res = NextResponse.next()

  // CRM and API: never cache — always fresh from server
  if (pathname.startsWith("/crm") || pathname.startsWith("/api")) {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
  }

  return res
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|manifest.json).*)",
  ],
}
