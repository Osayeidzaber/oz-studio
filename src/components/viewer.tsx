"use client"
import { useEffect, useRef, useState } from "react"
import { gsap } from "./motion"
import { hostOf, sites, type Site } from "@/data/studio"

/**
 * The showroom: a full-screen, natively scrollable capture of a live site in a
 * desktop or phone frame. Uses <dialog> for focus trapping and Escape.
 */
export function Viewer({ site, onClose }: { site: Site | null; onClose: () => void }) {
  const dlg = useRef<HTMLDialogElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLElement>(null)
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop")
  const [current, setCurrent] = useState<Site | null>(site)

  useEffect(() => {
    const d = dlg.current!
    if (site) {
      setCurrent(site)
      if (!d.open) d.showModal()
      window.__lenis?.stop()
      gsap.fromTo(d, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "expo.inOut" })
      gsap.fromTo(d.querySelectorAll(".vw-anim"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.05, delay: 0.35 })
    } else if (d.open) {
      gsap.to(d, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut", onComplete: () => { d.close(); window.__lenis?.start() } })
    }
  }, [site])

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
    if (bar.current) bar.current.style.transform = "scaleY(0)"
  }, [current, mode])

  const onScroll = () => {
    const el = scroller.current!
    bar.current!.style.transform = `scaleY(${el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)})`
  }
  const step = (dir: number) => {
    if (!current) return
    const i = sites.findIndex((s) => s.slug === current.slug)
    setCurrent(sites[(i + dir + sites.length) % sites.length])
  }

  const cap = current ? current[mode] : null
  return (
    <dialog ref={dlg} className="viewer" aria-label={current ? `${current.title} showroom` : "Showroom"} onCancel={(e) => { e.preventDefault(); onClose() }}>
      {current && cap && (
        <>
          <div className="vw-top">
            <div className="vw-anim">
              <span className="label">SHOWROOM — {current.category.toUpperCase()}</span>
              <p className="vw-title">{current.title}</p>
            </div>
            <div className="vw-controls vw-anim">
              <div className="seg" role="group" aria-label="Device">
                <button aria-pressed={mode === "desktop"} onClick={() => setMode("desktop")}>Desktop</button>
                <button aria-pressed={mode === "mobile"} onClick={() => setMode("mobile")}>Phone</button>
              </div>
              <a href={current.liveUrl} target="_blank" rel="noreferrer" className="btn btn-light"><span className="btn-fill" />Visit live <span aria-hidden>↗</span></a>
              <button className="vw-close" onClick={onClose} autoFocus><span className="sr-only">Close showroom</span><i /><i /></button>
            </div>
          </div>
          <div className={`vw-body vw-anim ${mode}`}>
            <button className="vw-step" onClick={() => step(-1)} aria-label="Previous site">←</button>
            <div className="vw-device">
              {mode === "desktop" && <span className="win-bar"><span className="dots" aria-hidden><i /><i /><i /></span><span className="addr">{hostOf(current.liveUrl)}</span></span>}
              <div ref={scroller} className="vw-scroll" data-lenis-prevent tabIndex={0} onScroll={onScroll} aria-label={`${current.title} ${mode} homepage, scrollable`}>
                <img key={cap.src} src={cap.src} alt={`Full ${mode} homepage of ${current.title}`} width={cap.width} height={cap.height} />
              </div>
              <span className="vw-rail" aria-hidden><i ref={bar} /></span>
            </div>
            <button className="vw-step" onClick={() => step(1)} aria-label="Next site">→</button>
          </div>
          <p className="vw-hint label vw-anim">SCROLL INSIDE THE WINDOW · ESC TO CLOSE</p>
        </>
      )}
    </dialog>
  )
}
