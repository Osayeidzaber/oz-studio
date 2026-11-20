"use client"
import { useRef } from "react"
import { gsap, useGSAP, prefersReduced } from "./motion"
import { RevealTitle } from "./reveal"

const copy = "OZ Studio is my independent design and development practice. I’m Osayeed, a full-stack developer based in Dhaka, building across the web and Shopify. I like being close to the whole thing: understanding what needs to work, shaping how it feels, and writing the code that brings it together."

/** The statement reads itself in: each word brightens as it crosses the viewport. */
export function About() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (prefersReduced()) return
    gsap.fromTo(".ab-word", { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: ".ab-copy", start: "top 78%", end: "bottom 45%", scrub: 0.5 } })
    gsap.to(".ab-mark", { rotate: 90, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 } })
  }, { scope: root })
  return (
    <section ref={root} id="about" className="about" aria-labelledby="ab-title">
      <div className="ab-side">
        <p className="label">05 / THE PERSON BEHIND THE MARK</p>
        <RevealTitle id="ab-title" text="Independent|by *design.*" />
        <img className="ab-mark" src="/logo.svg" alt="" width={220} height={220} />
      </div>
      <div>
        <p className="ab-copy">{copy.split(" ").map((w, i) => <span className="ab-word" key={i}>{w} </span>)}</p>
        <p className="ab-sub">The studio gives that work a home of its own.</p>
        <a href="/osayeed-zaber" className="text-link">Meet Osayeed Zaber, the founder <span aria-hidden>→</span></a>
      </div>
    </section>
  )
}
