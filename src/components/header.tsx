"use client"
import { useEffect, useRef, useState } from "react"
import { gsap, ScrollTrigger } from "./motion"
import { Magnetic } from "./magnetic"
import { email } from "@/data/studio"

const links = [
  { href: "#work", label: "Work" },
  { href: "#practice", label: "Practice" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
]

/** Hides on the way down, returns on the way up; a full-screen menu on small screens. */
export function Header() {
  const bar = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => {
        const el = bar.current!
        el.classList.toggle("is-solid", self.scroll() > 40)
        gsap.to(el, { yPercent: self.direction === 1 && self.scroll() > 300 ? -110 : 0, duration: 0.5, ease: "expo.out", overwrite: "auto" })
      },
    })
    return () => st.kill()
  }, [])
  useEffect(() => {
    if (open) window.__lenis?.stop(); else window.__lenis?.start()
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", esc)
    return () => window.removeEventListener("keydown", esc)
  }, [open])

  return (
    <>
      <header ref={bar} className="site-header">
        <a href="#top" className="wordmark" aria-label="OZ Studio, back to top">OZ<i className="dot" /><span>STUDIO</span></a>
        <nav aria-label="Primary" className="header-nav">
          {links.map((l) => <a key={l.href} href={l.href} className="roll"><span className="roll-clip"><span data-text={l.label}>{l.label}</span></span></a>)}
        </nav>
        <Magnetic><a href="#contact" className="pill">Start a project <span aria-hidden>↗</span></a></Magnetic>
        <button className="menu-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span><i /><i />
        </button>
      </header>
      <div id="menu" className={`menu ${open ? "is-open" : ""}`} hidden={!open}>
        <nav aria-label="Menu">
          {[...links, { href: "#contact", label: "Contact" }].map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ transitionDelay: `${0.06 * i + 0.1}s` }}>
              <span className="label">0{i + 1}</span>{l.label}
            </a>
          ))}
        </nav>
        <a className="menu-mail" href={`mailto:${email}`}>{email}</a>
      </div>
    </>
  )
}
