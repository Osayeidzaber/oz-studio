import { founder, siteUrl } from "@/data/founder"

export const dynamic = "force-static"

export function GET() {
  const body = `/* TEAM */
Founder, design and development: ${founder.name}
Site: ${siteUrl}
Location: ${founder.location.label}
Contact: ${founder.email}
GitHub: ${founder.socials[0].url}

/* SITE */
Built with: Next.js, React, TypeScript, GSAP, Lenis
Hosted on: Vercel
`
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
