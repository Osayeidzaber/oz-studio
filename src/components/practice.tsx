"use client"
import { useRef } from "react"
import { gsap, useGSAP, prefersReduced } from "./motion"
import { RevealTitle } from "./reveal"
import { services } from "@/data/studio"

/** Service cards that stick and stack; each one settles back as the next slides over it. */
export function Practice() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (prefersReduced()) return
    const cards = gsap.utils.toArray<HTMLElement>(".svc", root.current)
    cards.forEach((card, i) => {
      const next = cards[i + 1]
      if (!next) return
      gsap.to(card.querySelector(".svc-inner"), {
        scale: 0.92, opacity: 0.35, filter: "blur(2px)", ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top 18%", scrub: true },
      })
    })
  }, { scope: root })
  return (
    <section ref={root} id="practice" className="practice" aria-labelledby="pr-title">
      <div className="section-head">
        <div><p className="label">03 / THE PRACTICE</p><RevealTitle id="pr-title" text="From first sketch|to *what’s next.*" /></div>
        <p className="section-note">Design and development, together. One person close to the whole project.</p>
      </div>
      <div className="svc-list">
        {services.map((s, i) => (
          <article className="svc" key={s.number} style={{ top: `calc(14vh + ${i * 28}px)` }}>
            <div className="svc-inner">
              <span className="svc-num serif">{s.number}</span>
              <div className="svc-body">
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <ul className="chips">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
