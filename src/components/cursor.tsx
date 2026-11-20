"use client"
import { useEffect, useRef } from "react"
import { gsap } from "./motion"

/** A dot and a ring that trails the pointer and swells with a label over [data-cursor]. Fine pointers only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    document.documentElement.classList.add("has-cursor")
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.1, ease: "power3" })
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.1, ease: "power3" })
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" })
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" })
    const r = ring.current!
    const text = r.querySelector("span")!
    let px = -100, py = -100
    const sync = (target: Element | null) => {
      const t = target?.closest<HTMLElement>("[data-cursor], a, button, summary, label, input, textarea")
      const label = t?.dataset.cursor ?? ""
      r.dataset.state = t ? (label ? "label" : "link") : ""
      if (text.textContent !== label) text.textContent = label
    }
    const move = (e: PointerEvent) => {
      px = e.clientX; py = e.clientY
      dx(px); dy(py); rx(px); ry(py)
      sync(e.target as Element)
    }
    // Content moves under a still pointer while scrolling; re-read what is beneath it.
    const scroll = () => { if (r.dataset.state !== "hidden") sync(document.elementFromPoint(px, py)) }
    const leave = () => { r.dataset.state = "hidden" }
    window.addEventListener("pointermove", move)
    window.addEventListener("scroll", scroll, { passive: true })
    document.documentElement.addEventListener("pointerleave", leave)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("scroll", scroll)
      document.documentElement.removeEventListener("pointerleave", leave)
      document.documentElement.classList.remove("has-cursor")
    }
  }, [])
  return <><div ref={dot} className="cursor-dot" aria-hidden /><div ref={ring} className="cursor-ring" aria-hidden><span /></div></>
}
