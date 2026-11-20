import { NextResponse, type NextRequest } from "next/server"

/**
 * The admin is gated with HTTP Basic auth against ADMIN_PASSWORD (any username).
 * Nothing about invoices is ever sent to the server: the PDF and email are made in the
 * browser and drafts live in that browser's storage. The gate keeps the tool private.
 */
export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    // Local development works without setup; a deployment without a password stays shut.
    if (process.env.NODE_ENV === "development") return NextResponse.next()
    return new NextResponse("Admin is disabled. Set ADMIN_PASSWORD in the deployment's environment variables.", { status: 503 })
  }
  const header = request.headers.get("authorization") ?? ""
  const [scheme, encoded] = header.split(" ")
  if (scheme === "Basic" && encoded) {
    let supplied = ""
    try { supplied = atob(encoded).split(":").slice(1).join(":") } catch {}
    if (same(supplied, password)) {
      const response = NextResponse.next()
      response.headers.set("X-Robots-Tag", "noindex, nofollow")
      response.headers.set("Cache-Control", "no-store")
      return response
    }
  }
  return new NextResponse("Authentication required.", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="OZ Studio admin", charset="UTF-8"', "X-Robots-Tag": "noindex" } })
}

/** Length-independent comparison so timing doesn't leak how much of the password matched. */
function same(a: string, b: string) {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b)
  let diff = x.length ^ y.length
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0)
  return diff === 0
}

export const config = { matcher: ["/admin", "/admin/:path*"] }
