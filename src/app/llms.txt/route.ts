import { faq, founder, founderPath, siteUrl } from "@/data/founder"
import { work } from "@/data/studio"

/** /llms.txt: a plain summary for AI search engines, built from the same facts as the pages. */
export const dynamic = "force-static"

export function GET() {
  const body = [
    "# OZ Studio",
    "",
    `> OZ Studio (${siteUrl}) is the independent design and development studio of ${founder.name}, a full-stack developer in ${founder.location.label}.`,
    "",
    `Also known as: ${founder.alternateNames.join(", ")}.`,
    "",
    "## Pages",
    `- [Home](${siteUrl}/): the studio, live work and services`,
    `- [${founder.name}](${siteUrl}${founderPath}): the founder, his story, timeline and toolkit`,
    "",
    "## Work",
    ...work.map((w) => `- ${w.title} (${w.category}): ${w.description}${w.liveUrl ? ` ${w.liveUrl}` : ""}`),
    "",
    "## About the founder",
    ...faq.map((f) => `### ${f.q}\n${f.a}\n`),
    "## Links",
    ...founder.socials.map((s) => `- ${s.label}: ${s.url}`),
    `- Email: ${founder.email}`,
    "",
  ].join("\n")
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
