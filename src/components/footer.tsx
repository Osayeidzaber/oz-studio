"use client"
import { useRef } from "react"
import { gsap, useGSAP, prefersReduced } from "./motion"

/** The wordmark rises out of the bottom edge as the page ends. */
export function Footer() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (prefersReduced()) return
    gsap.fromTo(".ft-giant span", { yPercent: 100 }, { yPercent: 0, stagger: 0.06, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 1 } })
  }, { scope: root })
  return (
    <footer ref={root} className="footer">
      <div className="ft-row">
        <p>An independent practice by <a href="/osayeed-zaber" className="ft-name">Osayeed Zaber</a>.</p>
        <nav aria-label="Footer">
          <a href="/osayeed-zaber">Founder</a>
          <a href="https://github.com/Osayeidzaber" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.instagram.com/z3ber._/" target="_blank" rel="noreferrer">Instagram ↗</a>
          <a href="#top">Back to top ↑</a>
        </nav>
      </div>
      <p className="ft-giant" aria-hidden>{"OZSTUDIO".split("").map((c, i) => <span key={i}>{c}</span>)}</p>
    </footer>
  )
}
