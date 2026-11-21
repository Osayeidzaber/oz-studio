import { faq, founder, founderPath, siteUrl } from "@/data/founder"
import { sites, work } from "@/data/studio"

/**
 * schema.org graph shared by every page. Stable @ids let Google join the studio,
 * the website and the founder into one entity, so a search for "Osayeed Zaber"
 * can resolve to the founder page and the studio together.
 */
export const ids = {
  person: `${siteUrl}/#osayeed-zaber`,
  org: `${siteUrl}/#organization`,
  website: `${siteUrl}/#website`,
}

export const keywords = [
  "Osayeed Zaber", "Osayeed", "Zaber", "Osayeid Zaber", "Osayeed Jaber", "Osayeidzaber", "Osayeed Zaber developer",
  "Osayeed Zaber Dhaka", "Osayeed Zaber Bangladesh", "Osayeed Zaber OZ Studio", "Zaber developer", "OZ Studio", "ozstudio", "ozstudio.cc", "OZ Studio Dhaka",
  "web developer Dhaka", "web design studio Dhaka", "full-stack developer Bangladesh",
  "Shopify developer Bangladesh", "Shopify theme developer", "Next.js developer", "Next.js developer Dhaka",
  "freelance web developer Bangladesh", "website design Uttara", "custom Shopify storefront", "admin dashboard development",
]

export const person = {
  "@type": "Person",
  "@id": ids.person,
  name: founder.name,
  givenName: founder.givenName,
  familyName: founder.familyName,
  alternateName: founder.alternateNames,
  jobTitle: founder.title,
  description: `${founder.name} is a full-stack developer in ${founder.location.locality}, ${founder.location.region}, and the founder of OZ Studio. ${founder.intro}`,
  url: `${siteUrl}${founderPath}`,
  image: `${siteUrl}${founderPath}/opengraph-image`,
  email: `mailto:${founder.email}`,
  address: { "@type": "PostalAddress", addressLocality: founder.location.locality, addressRegion: founder.location.region, addressCountry: "BD" },
  homeLocation: { "@type": "Place", name: founder.location.label },
  worksFor: { "@id": ids.org },
  founder: { "@id": ids.org },
  knowsAbout: founder.skills.flatMap((g) => g.items).concat(["Web design", "E-commerce", "Shopify theme development"]),
  sameAs: founder.socials.map((s) => s.url),
}

export const organization = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": ids.org,
  name: "OZ Studio",
  alternateName: ["OZ", "ozstudio", "OZ Studio by Osayeed Zaber"],
  url: siteUrl,
  logo: `${siteUrl}/logo.svg`,
  image: `${siteUrl}/opengraph-image`,
  description: "The independent design and development studio of Osayeed Zaber. Websites, Shopify storefronts, and the systems behind them. Based in Dhaka, working on the web.",
  email: founder.email,
  founder: { "@id": ids.person },
  employee: { "@id": ids.person },
  address: { "@type": "PostalAddress", addressLocality: founder.location.locality, addressRegion: founder.location.region, addressCountry: "BD" },
  areaServed: "Worldwide",
  knowsAbout: ["Web design", "Web development", "Shopify", "Next.js", "E-commerce", "Admin dashboards"],
  sameAs: founder.socials.map((s) => s.url),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: ["Web experiences", "Shopify storefronts", "Portals and dashboards"].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
}

export const website = {
  "@type": "WebSite",
  "@id": ids.website,
  url: siteUrl,
  name: "OZ Studio",
  alternateName: "OZ Studio — Osayeed Zaber",
  publisher: { "@id": ids.org },
  inLanguage: "en",
}

export const portfolioList = {
  "@type": "ItemList",
  name: "Work by OZ Studio",
  itemListElement: work.map((w, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: { "@type": "CreativeWork", name: w.title, description: w.description, ...(w.liveUrl ? { url: w.liveUrl } : {}), creator: { "@id": ids.person }, keywords: w.tech.join(", ") },
  })),
}

export const homeGraph = {
  "@context": "https://schema.org",
  "@graph": [
    organization, website, person, portfolioList,
    { "@type": "WebPage", "@id": `${siteUrl}/#webpage`, url: siteUrl, name: "OZ Studio — Independent design & development by Osayeed Zaber", isPartOf: { "@id": ids.website }, about: { "@id": ids.org }, mentions: { "@id": ids.person } },
  ],
}

export const founderGraph = {
  "@context": "https://schema.org",
  "@graph": [
    person, organization, website,
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}${founderPath}#webpage`,
      url: `${siteUrl}${founderPath}`,
      name: `${founder.name} — Founder of OZ Studio`,
      isPartOf: { "@id": ids.website },
      mainEntity: { "@id": ids.person },
      about: { "@id": ids.person },
      hasPart: sites.map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.liveUrl, creator: { "@id": ids.person } })),
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}${founderPath}#faq`,
      isPartOf: { "@id": `${siteUrl}${founderPath}#webpage` },
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "OZ Studio", item: siteUrl },
        { "@type": "ListItem", position: 2, name: founder.name, item: `${siteUrl}${founderPath}` },
      ],
    },
  ],
}

/** Serialises JSON-LD safely for a <script> tag. */
export const ld = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") })
