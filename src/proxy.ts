import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, sessionToken, same } from "@/lib/admin-session"

/**
 * The admin is gated by a signed cookie set on /admin/login. Invoices never reach the
 * server (PDF and email are made in the browser), so this gate is what keeps the tool private.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === "/admin/login"
  const password = process.env.ADMIN_PASSWORD
  const done = (res: NextResponse) => {
    res.headers.set("X-Robots-Tag", "noindex, nofollow")
    res.headers.set("Cache-Control", "no-store")
    return res
  }

  if (!password) {
    // Local development works without setup; a deployment without a password stays shut (the login page says why).
    if (process.env.NODE_ENV === "development" || isLogin) return done(NextResponse.next())
    return done(NextResponse.redirect(new URL("/admin/login", request.url)))
  }
  const signedIn = same(request.cookies.get(SESSION_COOKIE)?.value ?? "", await sessionToken(password))
  if (isLogin && signedIn) return done(NextResponse.redirect(new URL("/admin", request.url)))
  if (isLogin || signedIn || pathname === "/admin/logout") return done(NextResponse.next())
  return done(NextResponse.redirect(new URL("/admin/login", request.url)))
}

export const config = { matcher: ["/admin", "/admin/:path*"] }
