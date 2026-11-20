"use client"
import { useRef } from "react"
import { gsap, useGSAP, ScrollTrigger, prefersReduced } from "./motion"

const words = ["Web experiences", "Shopify storefronts", "Portals & dashboards", "Design to launch"]

/** An endless band whose speed and direction follow your scroll velocity. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    if (prefersReduced()) return
    const track = root.current!.querySelector<HTMLElement>(".mq-track")!
    const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 })
    let dir = 1
    ScrollTrigger.create({
      trigger: root.current, start: "top bottom", end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity()
        if (Math.abs(v) > 10) dir = v > 0 ? 1 : -1
        gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 400, 5)), duration: 0.2, overwrite: true })
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2, ease: "power2.out" })
        gsap.to(track, { skewX: gsap.utils.clamp(-8, 8, -v / 300), duration: 0.4, overwrite: "auto" })
      },
    })
  }, { scope: root })
  const row = words.map((w) => <span key={w} className="mq-item">{w}<i aria-hidden>✶</i></span>)
  return (
    <div ref={root} className="marquee" aria-label={words.join(", ")}>
      <div className="mq-track" aria-hidden>{row}{row}{row}{row}</div>
    </div>
  )
}
