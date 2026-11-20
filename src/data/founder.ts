/** The founder. Facts carried over from the personal portfolio's content; nothing invented. */
import { email } from "./email"
export const siteUrl = "https://ozstudio.cc"
export const founderPath = "/osayeed-zaber"

export const founder = {
  name: "Osayeed Zaber",
  givenName: "Osayeed",
  familyName: "Zaber",
  // Spellings people actually use: the GitHub handle and the email both differ from the display name.
  alternateNames: ["Osayeed", "Zaber", "Osayeid Zaber", "Osayeed Jaber"],
  title: "Full-stack developer",
  role: "Founder, OZ Studio",
  location: { locality: "Uttara", region: "Dhaka", country: "Bangladesh", label: "Uttara, Dhaka, Bangladesh" },
  email,
  availability: "Available for new projects",
  intro: "I build in Next.js, TypeScript and Liquid — for clothing brands, a water company in Vancouver, and a council of student diplomats.",
  heading: "I write the code and sweat the pixels.",
  paragraphs: [
    "I’m Osayeed, a full-stack developer in Uttara, Dhaka. Most of my work is Next.js and TypeScript on the front, Supabase or Node on the back, and a lot of Liquid for Shopify brands.",
    "I’ve shipped storefronts for Corso Velle and ARZ, a delivery platform for TajWater in Vancouver, and the websites and certificate system for IGAC. Off the clock: anime, ramen, and too many side projects.",
  ],
  quote: "Currently learning: whatever the last project made me realise I didn’t know.",
  socials: [
    { label: "GitHub", handle: "@Osayeidzaber", url: "https://github.com/Osayeidzaber" },
    { label: "Instagram", handle: "@z3ber._", url: "https://www.instagram.com/z3ber._/" },
  ],
  pillars: [
    { title: "Development", body: "Next.js apps with real back offices: auth, Stripe, Supabase, role-gated admin panels." },
    { title: "Commerce", body: "Custom Shopify themes in Liquid, built section by section for fashion labels." },
    { title: "Community", body: "Websites and the certificate system for IGAC’s Model UN sessions." },
    { title: "Off-screen", body: "Anime, ramen, and debugging through the loud episodes." },
  ],
  skills: [
    { category: "Frontend", items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "JavaScript", "HTML & CSS"] },
    { category: "Backend", items: ["Supabase", "Node.js", "Express", "MongoDB", "PostgreSQL"] },
    { category: "Commerce", items: ["Shopify", "Liquid", "Stripe"] },
    { category: "Tools", items: ["Git & GitHub", "Docker", "Vercel", "Python", "VS Code"] },
  ],
  interests: ["Anime", "Ramen", "Shopify themes", "Admin dashboards", "Model UN", "Open source", "Motion on the web", "Late-night debugging"],
  timeline: [
    { date: "2026-10", title: "Corso Velle storefront", org: "Corso Velle", body: "Custom Shopify theme: full-screen video hero, drag-to-explore new arrivals, mobile media overrides.", link: "https://corsovelle.com" },
    { date: "2026-09", title: "Corso Velle CRM", org: "Corso Velle", body: "Internal tooling for the brand, in Next.js and TypeScript." },
    { date: "2026-05", title: "IGAC platform", org: "International Global Affairs Council", body: "The council’s website at igac.info: sessions, councils and registration.", link: "https://www.igac.info" },
    { date: "2026-03", title: "TajWater", org: "TajWater, Vancouver", body: "Storefront, recurring subscriptions with Stripe, and a Supabase back office for ten delivery zones.", link: "https://tajwater.ca" },
    { date: "2026-02", title: "ARZ storefront", org: "ARZ Lifestyle", body: "Shopify theme for a traditional clothing store.", link: "https://arzlifestyle.com/" },
    { date: "2025-11", title: "IGAC MUN certificates", org: "International Global Affairs Council", body: "Admin portal to issue, bulk-import from Google Sheets, verify and revoke certificates." },
    { date: "2024-11", title: "Started on GitHub", org: "", body: "First public repos: a glassmorphism todo list and a lot of experiments.", link: "https://github.com/Osayeidzaber" },
  ],
}

export const formatMonth = (ym: string) => {
  const [y, m] = ym.split("-").map(Number)
  return `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]} ${y}`
}
