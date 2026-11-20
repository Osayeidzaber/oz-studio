import { SmoothScroll } from "@/components/smooth-scroll"
import { Preloader } from "@/components/preloader"
import { Cursor } from "@/components/cursor"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Marquee } from "@/components/marquee"
import { Showcase } from "@/components/showcase"
import { WorkIndex } from "@/components/work-index"
import { Practice } from "@/components/practice"
import { Process } from "@/components/process"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { homeGraph, ld } from "@/lib/seo"

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(homeGraph)} />
      <a href="#main" className="skip-link">Skip to content</a>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Showcase />
        <WorkIndex />
        <Practice />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </>
  )
}
