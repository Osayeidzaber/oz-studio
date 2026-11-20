"use client"
import { useEffect } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger, prefersReduced } from "./motion"

declare global { interface Window { __lenis?: Lenis } }

/** Lenis drives the page scroll on GSAP's ticker so ScrollTrigger and scroll share one loop. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, anchors: { offset: -20 } })
    window.__lenis = lenis
    if (document.documentElement.classList.contains("is-loading")) lenis.stop()
    lenis.on("scroll", ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    let h = document.body.scrollHeight
    const ro = new ResizeObserver(() => { if (document.body.scrollHeight !== h) { h = document.body.scrollHeight; ScrollTrigger.refresh() } })
    ro.observe(document.body)
    return () => { ro.disconnect(); gsap.ticker.remove(tick); lenis.destroy(); delete window.__lenis }
  }, [])
  return null
}
