"use client"
import { useRef } from "react"
import { gsap, useGSAP } from "./motion"
import { RevealTitle, Reveal } from "./reveal"
import { work } from "@/data/studio"

/** Every project as a row; on fine pointers a cover floats after the cursor. */
export function WorkIndex() {
  const root = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    const p = preview.current!
    const x = gsap.quickTo(p, "x", { duration: 0.6, ease: "power3" })
    const y = gsap.quickTo(p, "y", { duration: 0.6, ease: "power3" })
    const list = root.current!.querySelector<HTMLElement>(".idx-list")!
    let lastY = 0
    const move = (e: PointerEvent) => {
      x(e.clientX); y(e.clientY)
      gsap.to(p, { rotate: gsap.utils.clamp(-10, 10, (e.clientY - lastY) * 0.6), duration: 0.5, overwrite: "auto" })
      lastY = e.clientY
    }
    const enterRow = (e: Event) => {
      const row = e.currentTarget as HTMLElement
      const src = row.dataset.cover
      if (!src) { gsap.to(p, { scale: 0, opacity: 0, duration: 0.3 }); return }
      const imgs = p.querySelectorAll("img")
      const top = imgs[1]
      top.src = src
      gsap.fromTo(top, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.6, ease: "expo.out", onComplete: () => { imgs[0].src = src } })
      gsap.to(p, { scale: 1, opacity: 1, duration: 0.5, ease: "expo.out" })
    }
    const leave = () => gsap.to(p, { scale: 0, opacity: 0, duration: 0.4, ease: "expo.out" })
    const rows = list.querySelectorAll<HTMLElement>(".idx-row")
    rows.forEach((r) => r.addEventListener("pointerenter", enterRow))
    list.addEventListener("pointermove", move)
    list.addEventListener("pointerleave", leave)
    return () => { rows.forEach((r) => r.removeEventListener("pointerenter", enterRow)); list.removeEventListener("pointermove", move); list.removeEventListener("pointerleave", leave) }
  }, { scope: root })

  return (
    <section ref={root} id="index" className="index" aria-labelledby="idx-title">
      <div className="section-head">
        <div><p className="label">02 / SELECTED WORK</p><RevealTitle id="idx-title" text="Proof in the|*making.*" /></div>
        <p className="section-note">Selected projects by Osayeed: storefronts, sites and tools. The foundation of a new studio.</p>
      </div>
      <Reveal className="idx-list">
        {work.map((w, i) => {
          const inner = (
            <>
              <span className="label idx-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="idx-title">{w.title}</span>
              <span className="idx-desc">{w.description}</span>
              <span className="label idx-cat">{w.category.toUpperCase()}</span>
              <span className="idx-arrow" aria-hidden>{w.liveUrl ? "↗" : "·"}</span>
            </>
          )
          return w.liveUrl
            ? <a key={w.title} className="idx-row" href={w.liveUrl} target="_blank" rel="noreferrer" data-cover={w.cover} data-cursor="Visit">{inner}</a>
            : <div key={w.title} className="idx-row" data-cover={w.cover}>{inner}</div>
        })}
      </Reveal>
      <div ref={preview} className="idx-preview" aria-hidden><img alt="" /><img alt="" /></div>
    </section>
  )
}
