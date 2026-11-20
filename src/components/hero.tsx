"use client"
import { useRef } from "react"
import { gsap, useGSAP, onReady, prefersReduced } from "./motion"
import { Magnetic } from "./magnetic"
import { sites, hostOf, email } from "@/data/studio"

/**
 * Headline rises in after the intro; three live-site windows float in a 3D stack that
 * tilts toward the pointer and fans apart as you scroll away.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    const q = gsap.utils.selector(root)
    const reduce = prefersReduced()
    if (!reduce) {
      gsap.set(q(".hero-title .w > span"), { yPercent: 120 })
      gsap.set(q(".hero-fade"), { opacity: 0, y: 24 })
      gsap.set(q(".stack-win"), { opacity: 0, y: 160, rotateX: 30 })
      onReady(() => {
        gsap.timeline({ defaults: { ease: "expo.out" } })
          .to(q(".hero-title .w > span"), { yPercent: 0, duration: 1.4, stagger: 0.07 })
          .to(q(".hero-fade"), { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.35)
          .to(q(".stack-win"), { opacity: 1, y: 0, rotateX: 0, duration: 1.6, stagger: 0.12 }, 0.2)
      })

      // Scroll: the stack fans out and the headline drifts.
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 } })
        .to(q(".stack-win:nth-child(1)"), { xPercent: -26, yPercent: 14, rotate: -7 }, 0)
        .to(q(".stack-win:nth-child(2)"), { yPercent: -22, scale: 1.04 }, 0)
        .to(q(".stack-win:nth-child(3)"), { xPercent: 24, yPercent: 30, rotate: 6 }, 0)
        .to(q(".hero-copy"), { yPercent: -18, opacity: 0.2 }, 0)
    }

    if (!reduce && window.matchMedia("(pointer: fine)").matches) {
      const stage = q(".stack")[0] as HTMLElement
      const rx = gsap.quickTo(stage, "rotateX", { duration: 1.2, ease: "power3" })
      const ry = gsap.quickTo(stage, "rotateY", { duration: 1.2, ease: "power3" })
      const move = (e: PointerEvent) => { ry((e.clientX / innerWidth - 0.5) * 16); rx(-(e.clientY / innerHeight - 0.5) * 12) }
      window.addEventListener("pointermove", move)
      return () => window.removeEventListener("pointermove", move)
    }
  }, { scope: root })

  const title = [["Good", "ideas."], ["Built", "*properly.*"]]
  return (
    <section ref={root} id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-meta hero-fade"><span className="label">INDEPENDENT DESIGN &amp; DEVELOPMENT</span><span className="label">DHAKA / WORKING ON THE WEB</span></div>
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow hero-fade">A small studio. A considered approach.</p>
          <h1 id="hero-title" className="hero-title" aria-label="Good ideas. Built properly.">
            {title.map((line, i) => (
              <span className="line" key={i} aria-hidden>
                {line.map((w) => <span className="w" key={w}><span className={w.startsWith("*") ? "serif" : undefined}>{w.replace(/\*/g, "")}</span></span>)}
              </span>
            ))}
          </h1>
          <p className="hero-intro hero-fade">Websites, storefronts, and the systems behind them. An independent practice by Osayeed Zaber, built around the details that make a difference.</p>
          <div className="hero-actions hero-fade">
            <Magnetic><a href={`mailto:${email}?subject=Let%E2%80%99s%20make%20something%20with%20OZ%20Studio`} className="btn btn-light"><span className="btn-fill" />Let’s make something <span aria-hidden>↗</span></a></Magnetic>
            <a href="#work" className="text-link">See it live <span aria-hidden>↓</span></a>
          </div>
        </div>
        <div className="stack" aria-label="Live sites by OZ Studio">
          {sites.map((s) => (
            <a key={s.slug} href="#work" className="stack-win" data-cursor="View">
              <span className="win-bar"><span className="dots" aria-hidden><i /><i /><i /></span><span className="addr">{hostOf(s.liveUrl)}</span></span>
              <img src={s.cover} alt={`${s.title} homepage`} width={1440} height={900} fetchPriority="high" />
              <span className="stack-tag label">{s.title.toUpperCase()}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="hero-foot hero-fade">
        <span className="label">SCROLL</span><span className="scroll-line" aria-hidden><i /></span>
        <span className="label">{String(sites.length).padStart(2, "0")} SITES LIVE IN PRODUCTION</span>
      </div>
    </section>
  )
}
