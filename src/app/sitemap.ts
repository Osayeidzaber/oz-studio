import type { MetadataRoute } from "next"
import { founderPath, siteUrl } from "@/data/founder"
import { sites } from "@/data/studio"

// A fixed date keeps the sitemap static; bump it when the content changes.
const updated = new Date("2026-11-20")

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: updated, changeFrequency: "monthly", priority: 1, images: sites.map((s) => `${siteUrl}${s.cover}`) },
    { url: `${siteUrl}${founderPath}`, lastModified: updated, changeFrequency: "monthly", priority: 0.9, images: [`${siteUrl}${founderPath}/opengraph-image`] },
  ]
}
