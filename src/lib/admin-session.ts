/**
 * Admin session token: an HMAC of a fixed label keyed with ADMIN_PASSWORD. It works in the
 * proxy and in server actions (Web Crypto), and changing the password signs everyone out.
 */
export const SESSION_COOKIE = "oz_admin"
export const SESSION_DAYS = 30

export async function sessionToken(password: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("oz-studio-admin-v1"))
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("")
}

/** Length-independent comparison so timing doesn't leak how much matched. */
export function same(a: string, b: string) {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b)
  let diff = x.length ^ y.length
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0)
  return diff === 0
}
