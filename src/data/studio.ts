/**
 * Everything the site says. Facts only: no invented clients, stats or quotes.
 * Captures are full-page screenshots of the live sites (most refuse to be framed),
 * so the showroom scrolls a real capture and links out to the live site.
 */
export { email } from "./email"

export type Capture = { src: string; width: number; height: number }
export type Site = {
  slug: string
  title: string
  category: string
  description: string
  tech: string[]
  liveUrl: string
  cover: string
  desktop: Capture
  mobile: Capture
}

const cap = (slug: string, dh: number, mh: number) => ({
  cover: `/work/${slug}-live.jpg`,
  desktop: { src: `/work/${slug}-full-desktop.jpg`, width: 1440, height: dh },
  mobile: { src: `/work/${slug}-full-mobile.jpg`, width: 390, height: mh },
})

export const sites: Site[] = [
  {
    slug: "corso-velle",
    title: "Corso Velle",
    category: "Shopify",
    description: "A Shopify Online Store 2.0 theme with editorial shopping, interactive product discovery and a custom cart experience.",
    tech: ["Liquid", "TypeScript", "GSAP", "Vite", "Shopify"],
    liveUrl: "https://corsovelle.com",
    ...cap("corso-velle", 5520, 5478),
  },
  {
    slug: "dhaka-chronicles",
    title: "Dhaka Chronicles",
    category: "Full-stack",
    description: "A news website from Dhaka, with sections for national news, politics, the city, business, sports and entertainment.",
    tech: ["Next.js"],
    liveUrl: "https://dhakachronicles.com/en",
    ...cap("dhaka-chronicles", 6300, 7596),
  },
  {
    slug: "tajwater",
    title: "TajWater",
    category: "Full-stack",
    description: "Water delivery for ten Metro Vancouver zones: one-time and subscription orders, delivery tracking, and a role-gated admin panel.",
    tech: ["Next.js 16", "TypeScript", "Tailwind v4", "Supabase", "Stripe"],
    liveUrl: "https://tajwater.ca",
    ...cap("tajwater", 6300, 7596),
  },
]

export type Work = { title: string; category: string; description: string; tech: string[]; liveUrl?: string; cover?: string }

export const work: Work[] = [
  ...sites.map(({ title, category, description, tech, liveUrl, cover }) => ({ title, category, description, tech, liveUrl, cover })),
  { title: "IGAC", category: "Full-stack", description: "The International Global Affairs Council website: sessions, councils and registration.", tech: ["Next.js", "TypeScript"], liveUrl: "https://www.igac.info", cover: "/work/igac-live.jpg" },
  { title: "ARZ", category: "Shopify", description: "A custom Shopify storefront theme for ARZ, a traditional clothing store.", tech: ["Liquid", "Shopify"], liveUrl: "https://arzlifestyle.com/" },
  { title: "IGAC Certificates", category: "Tools", description: "Admin portal to issue MUN certificates, bulk-import them from Google Sheets, track verifications and revoke them.", tech: ["Next.js 15", "Supabase", "Tailwind CSS"] },
  { title: "IGACMUN Session III", category: "Web", description: "The official website for the third session of IGAC's Model United Nations conference.", tech: ["HTML", "CSS", "JavaScript"], liveUrl: "https://igacmun.vercel.app", cover: "/work/igacmun-session-iii-live.jpg" },
]

export const services = [
  { number: "01", name: "Web experiences", description: "Websites that put a clear story and careful interaction first. From a first impression to the final form submission.", tags: ["Next.js", "React", "Interaction"] },
  { number: "02", name: "Commerce, considered.", description: "Custom Shopify storefronts shaped around the products, the people buying them, and the people running the store.", tags: ["Shopify", "Liquid", "Storefronts"] },
  { number: "03", name: "The systems behind it.", description: "Admin portals, client dashboards, delivery workflows and practical tools that make the everyday work easier.", tags: ["Dashboards", "Portals", "Workflows"] },
]

export const steps = [
  { name: "Understand.", description: "A conversation about the problem and the people." },
  { name: "Shape.", description: "A clear direction, scope and plan." },
  { name: "Build.", description: "Thoughtful design, working software, regular check-ins." },
  { name: "Launch.", description: "The details checked, the work handed over." },
]

export const hostOf = (url: string) => {
  try {
    const u = new URL(url)
    return u.host.replace(/^www\./, "") + (u.pathname === "/" ? "" : u.pathname.replace(/\/$/, ""))
  } catch {
    return url
  }
}
