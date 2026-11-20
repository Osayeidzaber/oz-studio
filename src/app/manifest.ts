import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OZ Studio — Osayeed Zaber",
    short_name: "OZ Studio",
    description: "The independent design and development studio of Osayeed Zaber.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [{ src: "/logo.svg", sizes: "any", type: "image/svg+xml" }],
  }
}
