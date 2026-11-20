import type { MetadataRoute } from "next"
import { siteUrl } from "@/data/founder"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
