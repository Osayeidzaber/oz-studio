"use client"
import { useRef } from "react"
import { gsap, useGSAP, prefersReduced } from "./motion"
import { RevealTitle } from "./reveal"
import { steps } from "@/data/studio"

/** A rule that draws down the steps as you scroll, lighting each one as it passes. */
export function Process() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (prefersReduced()) { gsap.set(".step", { opacity: 1 }); return }
    gsap.fromTo(".proc-line i", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".proc-steps", start: "top 65%", end: "bottom 65%", scrub: 0.6 } })
    gsap.utils.toArray<HTMLElement>(".step").forEach((s) => {
      gsap.fromTo(s, { opacity: 0.18 }, { opacity: 1, duration: 0.6, scrollTrigger: { trigger: s, start: "top 65%", toggleActions: "play none none reverse" } })
      gsap.from(s.querySelector("h3"), { xPercent: -6, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 65%", toggleActions: "play none none reverse" } })
    })
  }, { scope: root })
  return (
    <section ref={root} id="process" className="process" aria-labelledby="proc-title">
      <div className="section-head">
        <div><p className="label">04 / HOW WE’LL WORK</p><RevealTitle id="proc-title" text="Four steps.|*No surprises.*" /></div>
        <p className="section-note">Clear stages, regular check-ins, and a proper handover at the end.</p>
      </div>
      <ol className="proc-steps">
        <span className="proc-line" aria-hidden><i /></span>
        {steps.map((s, i) => (
          <li className="step" key={s.name}>
            <span className="label">{String(i + 1).padStart(2, "0")}</span>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
