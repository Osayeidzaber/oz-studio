"use client"
import { useRef, useState } from "react"
import { gsap, useGSAP, ScrollTrigger, prefersReduced } from "./motion"
import { Magnetic } from "./magnetic"
import { RevealTitle } from "./reveal"
import { Viewer } from "./viewer"
import { sites, hostOf, type Site } from "@/data/studio"

/**
 * The live sites. On wide screens the section pins and the track runs sideways;
 * as each panel passes, its real homepage scrolls inside the browser window and the
 * phone beside it. On small screens the same panels stack and scroll in place.
 */
export function Showcase() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<Site | null>(null)

  useGSAP(() => {
    const q = gsap.utils.selector(root)
    const track = q(".sc-track")[0] as HTMLElement
    const panels = q(".sc-panel") as HTMLElement[]
    const mm = gsap.matchMedia()

    // Scroll the capture inside a frame from top to bottom over the given trigger.
    const scrollCaptures = (panel: HTMLElement, st: ScrollTrigger.Vars) => {
      panel.querySelectorAll<HTMLElement>("[data-scroll-capture]").forEach((img) => {
        const frame = img.parentElement!
        gsap.fromTo(img, { y: 0 }, { y: () => -(img.offsetHeight - frame.clientHeight), ease: "none", scrollTrigger: { ...st, scrub: 0.6, invalidateOnRefresh: true } })
      })
    }

    mm.add({ wide: "(min-width: 960px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const { wide, reduce } = ctx.conditions as { wide: boolean; reduce: boolean }
      if (reduce) return
      if (wide) {
        const distance = () => track.scrollWidth - window.innerWidth
        const tween = gsap.to(track, {
          x: () => -distance(), ease: "none",
          scrollTrigger: {
            trigger: q(".sc-pin")[0], pin: true, scrub: 1, start: "top top", end: () => `+=${distance()}`, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: (self) => {
              gsap.set(q(".sc-progress i"), { scaleX: self.progress })
              const i = Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1)))
              q(".sc-count b")[0].textContent = String(i + 1).padStart(2, "0")
            },
          },
        })
        panels.forEach((panel, i) => {
          scrollCaptures(panel, { trigger: panel, containerAnimation: tween, start: "left 70%", end: "right 30%" })
          // The first panel is already in place when the pin starts, so it enters on the vertical scroll.
          const enter = i === 0
            ? { trigger: panel, start: "top 70%", once: true }
            : { trigger: panel, containerAnimation: tween, start: "left 75%", toggleActions: "play none none reverse" }
          gsap.from(panel.querySelectorAll(".sc-info > *"), { x: 80, opacity: 0, stagger: 0.06, ease: "expo.out", duration: 1.2, scrollTrigger: enter })
          gsap.fromTo(panel.querySelector(".sc-phone"), { yPercent: 18, rotate: 8 }, { yPercent: -10, rotate: -4, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: 1 } })
        })
      } else {
        panels.forEach((panel) => {
          scrollCaptures(panel, { trigger: panel, start: "top 80%", end: "bottom 20%" })
          gsap.from(panel, { y: 80, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: panel, start: "top 88%", once: true } })
        })
      }
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section ref={root} id="work" className="showcase" aria-labelledby="sc-title">
      <div className="section-head">
        <div>
          <p className="label">01 / LIVE IN PRODUCTION</p>
          <RevealTitle id="sc-title" text="Don’t take our word.|*Browse* it." />
        </div>
        <p className="section-note">Real homepages, captured from the live sites. Keep scrolling and each one scrolls with you. Open any of them in the showroom, or visit it live.</p>
      </div>
      <div className="sc-pin">
        <div className="sc-hud" aria-hidden>
          <span className="sc-count label"><b>01</b> / {String(sites.length).padStart(2, "0")}</span>
          <span className="sc-progress"><i /></span>
        </div>
        <div className="sc-track">
          {sites.map((s, i) => (
            <article className="sc-panel" key={s.slug} aria-labelledby={`sc-${s.slug}`}>
              <div className="sc-info">
                <span className="label">{String(i + 1).padStart(2, "0")} — {s.category.toUpperCase()}</span>
                <h3 id={`sc-${s.slug}`}>{s.title}</h3>
                <p>{s.description}</p>
                <ul className="chips" aria-label="Built with">{s.tech.map((t) => <li key={t}>{t}</li>)}</ul>
                <div className="sc-actions">
                  <Magnetic strength={0.25}><button className="btn btn-light" onClick={() => setActive(s)}><span className="btn-fill" />Open showroom</button></Magnetic>
                  <a href={s.liveUrl} target="_blank" rel="noreferrer" className="text-link">Visit live <span aria-hidden>↗</span></a>
                </div>
              </div>
              <div className="sc-stage">
                <button className="browser" onClick={() => setActive(s)} data-cursor="Explore" aria-label={`Open ${s.title} in the showroom`}>
                  <span className="win-bar"><span className="dots" aria-hidden><i /><i /><i /></span><span className="addr">{hostOf(s.liveUrl)}</span><span className="label live-dot">LIVE</span></span>
                  <span className="frame"><img data-scroll-capture src={s.desktop.src} alt="" width={s.desktop.width} height={s.desktop.height} loading="lazy" decoding="async" /></span>
                </button>
                <span className="sc-phone" aria-hidden>
                  <span className="frame"><img data-scroll-capture src={s.mobile.src} alt="" width={s.mobile.width} height={s.mobile.height} loading="lazy" decoding="async" /></span>
                </span>
              </div>
            </article>
          ))}
          <div className="sc-end">
            <p className="label">MORE ON THE WAY</p>
            <p className="sc-end-title">Your site<br /><span className="serif">could be next.</span></p>
            <a href="#contact" className="text-link">Start a project <span aria-hidden>↗</span></a>
          </div>
        </div>
      </div>
      <Viewer site={active} onClose={() => setActive(null)} />
    </section>
  )
}
