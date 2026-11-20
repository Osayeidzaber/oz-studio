import { ogCard, ogSize } from "@/lib/og"

export const alt = "OZ Studio — Good ideas. Built properly. The independent studio of Osayeed Zaber."
export const size = ogSize
export const contentType = "image/png"

export default function Image() {
  return ogCard({ label: "INDEPENDENT DESIGN & DEVELOPMENT", line1: "Good ideas.", line2: "Built properly.", foot: "OZ Studio · by Osayeed Zaber · Dhaka" })
}
