import type { Metadata } from "next"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Preloader } from "@/components/preloader"
import { Cursor } from "@/components/cursor"
import { Header } from "@/components/header"
import { Marquee } from "@/components/marquee"
import { Footer } from "@/components/footer"
import { FounderHero, FounderStory, FounderPillars, FounderTimeline, FounderToolkit, FounderWork, FounderContact } from "@/components/founder"
import { founder, founderPath } from "@/data/founder"
import { founderGraph, keywords, ld } from "@/lib/seo"

const description = `${founder.name} is a full-stack developer in Uttara, Dhaka, and the founder of OZ Studio. He builds Shopify storefronts, Next.js platforms and admin portals for brands like Corso Velle, TajWater and IGAC.`

export const metadata: Metadata = {
  title: { absolute: `${founder.name} — Founder of OZ Studio · Full-stack developer in Dhaka` },
  description,
  keywords,
  alternates: { canonical: founderPath },
  authors: [{ name: founder.name, url: founderPath }],
  openGraph: {
    type: "profile",
    firstName: founder.givenName,
    lastName: founder.familyName,
    username: "Osayeidzaber",
    title: `${founder.name} — Founder of OZ Studio`,
    description,
    url: founderPath,
  },
  twitter: { card: "summary_large_image", title: `${founder.name} — Founder of OZ Studio`, description },
}

export default function FounderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(founderGraph)} />
      <a href="#main" className="skip-link">Skip to content</a>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <Header />
      <main id="main">
        <FounderHero />
        <Marquee words={founder.interests} />
        <FounderStory />
        <FounderPillars />
        <FounderTimeline />
        <FounderToolkit />
        <FounderWork />
        <FounderContact />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </>
  )
}
