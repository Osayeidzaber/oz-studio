"use server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SESSION_COOKIE, SESSION_DAYS, sessionToken, same } from "@/lib/admin-session"

export type LoginState = { error?: string }

export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return { error: "The admin is switched off. Set ADMIN_PASSWORD in the deployment, then redeploy." }
  const supplied = String(form.get("password") ?? "")
  if (!same(supplied, password)) {
    await new Promise((r) => setTimeout(r, 700)) // slow down guessing
    return { error: "That password isn’t right." }
  }
  const jar = await cookies()
  jar.set(SESSION_COOKIE, await sessionToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  })
  redirect("/admin")
}
