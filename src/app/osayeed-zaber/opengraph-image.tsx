import { ogCard, ogSize } from "@/lib/og"

export const alt = "Osayeed Zaber — Founder of OZ Studio, full-stack developer in Dhaka"
export const size = ogSize
export const contentType = "image/png"

export default function Image() {
  return ogCard({ label: "THE FOUNDER OF OZ STUDIO", line1: "Osayeed", line2: "Zaber", foot: "Full-stack developer · Uttara, Dhaka" })
}
