"use client"
import { useRef, useState } from "react"
import { gsap, useGSAP, markReady, prefersReduced } from "./motion"

/** A short counted intro, once per visit. The page is already rendered underneath. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)
  useGSAP(() => {
    let seen = false
    try { seen = sessionStorage.getItem("oz-intro") === "1"; sessionStorage.setItem("oz-intro", "1") } catch {}
    if (seen || prefersReduced()) { setGone(true); markReady(); return }
    document.documentElement.classList.add("is-loading")
    window.__lenis?.stop()
    const count = { v: 0 }
    const num = root.current!.querySelector<HTMLElement>("[data-count]")!
    const done = () => { document.documentElement.classList.remove("is-loading"); window.__lenis?.start(); setGone(true) }
    gsap.timeline({ onComplete: done })
      .from(".pl-mark > span", { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.08 })
      .to(count, { v: 100, duration: 1.3, ease: "power2.inOut", onUpdate: () => { num.textContent = String(Math.round(count.v)).padStart(3, "0") } }, 0)
      .to(".pl-bar i", { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 0)
      .to(".pl-mark > span", { yPercent: -110, duration: 0.6, ease: "expo.in", stagger: 0.04 }, ">-0.05")
      .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut", onStart: markReady }, ">-0.25")
  }, { scope: root })
  if (gone) return null
  return (
    <div ref={root} className="preloader" aria-hidden>
      <div className="pl-mark"><span>OZ</span><span className="pl-sub">STUDIO</span></div>
      <div className="pl-foot"><span className="label">INDEPENDENT DESIGN &amp; DEVELOPMENT</span><span className="pl-bar"><i /></span><span className="label" data-count>000</span></div>
    </div>
  )
}
