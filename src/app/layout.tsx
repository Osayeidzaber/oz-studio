import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { keywords } from "@/lib/seo"

const sans = Bricolage_Grotesque({ variable: "--font-sans", subsets: ["latin"], display: "swap" })
const serif = Instrument_Serif({ variable: "--font-serif", weight: "400", style: ["normal", "italic"], subsets: ["latin"], display: "swap" })
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL("https://ozstudio.cc"),
  title: { default: "OZ Studio — Web design & development by Osayeed Zaber", template: "%s · OZ Studio" },
  description: "OZ Studio is the independent design and development studio of Osayeed Zaber, a full-stack developer in Dhaka. Websites, Shopify storefronts, and the systems behind them.",
  applicationName: "OZ Studio",
  keywords,
  authors: [{ name: "Osayeed Zaber", url: "/osayeed-zaber" }],
  creator: "Osayeed Zaber",
  publisher: "OZ Studio",
  category: "technology",
  alternates: { canonical: "/" },
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  // Paste the Search Console HTML-tag token into GOOGLE_SITE_VERIFICATION to verify ozstudio.cc.
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  formatDetection: { email: false, telephone: false, address: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", locale: "en_US", siteName: "OZ Studio", url: "/", title: "OZ Studio — Good ideas. Built properly.", description: "The independent studio of Osayeed Zaber. Websites, Shopify storefronts, and the systems behind them." },
  twitter: { card: "summary_large_image", title: "OZ Studio — Good ideas. Built properly.", description: "The independent studio of Osayeed Zaber. Websites, Shopify storefronts, and the systems behind them." },
}

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
