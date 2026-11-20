import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const sans = Bricolage_Grotesque({ variable: "--font-sans", subsets: ["latin"], display: "swap" })
const serif = Instrument_Serif({ variable: "--font-serif", weight: "400", style: ["normal", "italic"], subsets: ["latin"], display: "swap" })
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL("https://ozstudio.cc"),
  title: "OZ Studio — Independent design & development",
  description: "The independent studio of Osayeed Zaber. Websites, Shopify storefronts, and the systems behind them. Based in Dhaka, working on the web.",
  alternates: { canonical: "/" },
  icons: { icon: "/logo.svg" },
  openGraph: { title: "OZ Studio", description: "Good ideas. Built properly. Websites, storefronts, and the systems behind them.", url: "https://ozstudio.cc", siteName: "OZ Studio", images: ["/work/corso-velle-live.jpg"] },
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
