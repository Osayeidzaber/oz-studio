"use client"
import { useRef } from "react"
import { gsap, useGSAP, onReady, prefersReduced } from "./motion"
import { Magnetic } from "./magnetic"
import { RevealTitle, Reveal } from "./reveal"
import { faq, founder, formatMonth } from "@/data/founder"
import { sites, hostOf } from "@/data/studio"

/** The name, one letter at a time, with the monogram turning beside it. */
export function FounderHero() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    const q = gsap.utils.selector(root)
    if (prefersReduced()) return
    gsap.set(q(".fh-char"), { yPercent: 110, rotate: 6 })
    gsap.set(q(".fh-fade"), { opacity: 0, y: 24 })
    gsap.set(q(".fh-mark"), { opacity: 0, scale: 0.6, rotate: -90 })
    onReady(() => {
      gsap.timeline({ defaults: { ease: "expo.out" } })
        .to(q(".fh-char"), { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.035 })
        .to(q(".fh-mark"), { opacity: 0.16, scale: 1, rotate: 0, duration: 1.8 }, 0.1)
        .to(q(".fh-fade"), { opacity: 1, y: 0, duration: 1.1, stagger: 0.07 }, 0.45)
    })
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 } })
      .to(q(".fh-line-1"), { xPercent: -8 }, 0)
      .to(q(".fh-line-2"), { xPercent: 8 }, 0)
      .to(q(".fh-mark"), { rotate: 120, yPercent: 30 }, 0)
    if (window.matchMedia("(pointer: fine)").matches) {
      const mark = q(".fh-mark-wrap")[0] as HTMLElement
      const rx = gsap.quickTo(mark, "rotateX", { duration: 1, ease: "power3" })
      const ry = gsap.quickTo(mark, "rotateY", { duration: 1, ease: "power3" })
      const move = (e: PointerEvent) => { ry((e.clientX / innerWidth - 0.5) * 40); rx(-(e.clientY / innerHeight - 0.5) * 30) }
      window.addEventListener("pointermove", move)
      return () => window.removeEventListener("pointermove", move)
    }
  }, { scope: root })

  const chars = (word: string) => word.split("").map((c, i) => <span className="fh-char" key={i}>{c}</span>)
  return (
    <section ref={root} id="top" className="fh" aria-labelledby="fh-title">
      <div className="hero-meta fh-fade"><span className="label">THE FOUNDER OF OZ STUDIO</span><span className="label">{founder.location.label.toUpperCase()}</span></div>
      <div className="fh-mark-wrap" aria-hidden><img className="fh-mark" src="/logo.svg" alt="" width={400} height={400} /></div>
      <h1 id="fh-title" className="fh-name" aria-label={founder.name}>
        <span className="fh-line fh-line-1" aria-hidden>{chars(founder.givenName)}</span>
        <span className="fh-line fh-line-2 serif" aria-hidden>{chars(founder.familyName)}</span>
      </h1>
      <div className="fh-bottom">
        <p className="fh-intro fh-fade">{founder.intro}</p>
        <dl className="fh-facts">
          <div className="fh-fade"><dt className="label">ROLE</dt><dd>{founder.title}<br />{founder.role}</dd></div>
          <div className="fh-fade"><dt className="label">BASED IN</dt><dd>{founder.location.locality}, {founder.location.region}</dd></div>
          <div className="fh-fade"><dt className="label">STATUS</dt><dd className="fh-status">{founder.availability}</dd></div>
          <div className="fh-fade"><dt className="label">ELSEWHERE</dt><dd>{founder.socials.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noreferrer me" className="fh-social">{s.label} <span aria-hidden>↗</span></a>)}</dd></div>
        </dl>
      </div>
    </section>
  )
}

/** The story: a sticky heading, copy that lights up as it is read, and the line he lives by. */
export function FounderStory() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (prefersReduced()) return
    gsap.fromTo(".fs-copy .ab-word", { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: ".fs-copy", start: "top 78%", end: "bottom 50%", scrub: 0.5 } })
    gsap.from(".fs-quote", { clipPath: "inset(0 100% 0 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".fs-quote", start: "top 85%", once: true } })
  }, { scope: root })
  return (
    <section ref={root} className="fs" aria-labelledby="fs-title">
      <div className="fs-side">
        <p className="label">01 / IN HIS WORDS</p>
        <RevealTitle id="fs-title" text="I write the code|and *sweat* the|*pixels.*" />
      </div>
      <div>
        <div className="fs-copy">{founder.paragraphs.map((p, i) => <p key={i}>{p.split(" ").map((w, j) => <span className="ab-word" key={j}>{w} </span>)}</p>)}</div>
        <blockquote className="fs-quote"><span className="serif">“{founder.quote.replace(/\.$/, "")}.”</span></blockquote>
      </div>
    </section>
  )
}

/** Four things he does, as cards that lift and follow the pointer with a soft spotlight. */
export function FounderPillars() {
  const track = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  return (
    <section className="fp" aria-labelledby="fp-title">
      <div className="section-head">
        <div><p className="label">02 / WHAT HE DOES</p><RevealTitle id="fp-title" text="Four things,|done *carefully.*" /></div>
        <p className="section-note">Development, commerce, community work, and the hours in between.</p>
      </div>
      <Reveal className="fp-grid">
        {founder.pillars.map((p, i) => (
          <article key={p.title} className="fp-card" onPointerMove={track}>
            <span className="label">/{String(i + 1).padStart(2, "0")}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </article>
        ))}
      </Reveal>
    </section>
  )
}

/** The record so far, newest first, drawn down a rule. */
export function FounderTimeline() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (prefersReduced()) return
    gsap.fromTo(".ft-rule i", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".tl-list", start: "top 70%", end: "bottom 70%", scrub: 0.6 } })
    gsap.utils.toArray<HTMLElement>(".tl-item").forEach((el) => {
      gsap.from(el, { opacity: 0, x: 60, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } })
    })
  }, { scope: root })
  return (
    <section ref={root} className="tl" aria-labelledby="tl-title">
      <div className="section-head">
        <div><p className="label">03 / THE RECORD</p><RevealTitle id="tl-title" text="Two years of|*shipping.*" /></div>
        <p className="section-note">From a first public repo in November 2024 to storefronts, platforms and portals in production.</p>
      </div>
      <ol className="tl-list">
        <span className="ft-rule" aria-hidden><i /></span>
        {founder.timeline.map((t) => {
          const body = (
            <>
              <time className="label tl-date" dateTime={t.date}>{formatMonth(t.date).toUpperCase()}</time>
              <span className="tl-title">{t.title}</span>
              <span className="tl-body">{t.org && <span className="tl-org">{t.org}. </span>}{t.body}</span>
              <span className="idx-arrow" aria-hidden>{t.link ? "↗" : ""}</span>
            </>
          )
          return (
            <li key={t.date + t.title} className="tl-item">
              {t.link ? <a className="tl-row is-link" href={t.link} target="_blank" rel="noreferrer" data-cursor="Visit">{body}</a> : <div className="tl-row">{body}</div>}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/** The stack, grouped, chips dealt in one after another. */
export function FounderToolkit() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (prefersReduced()) return
    gsap.utils.toArray<HTMLElement>(".tk-col").forEach((col) => {
      gsap.from(col.querySelectorAll("li"), { y: 30, opacity: 0, rotate: () => gsap.utils.random(-8, 8), duration: 0.9, ease: "back.out(1.6)", stagger: 0.05, scrollTrigger: { trigger: col, start: "top 85%", once: true } })
    })
  }, { scope: root })
  return (
    <section ref={root} className="tk" aria-labelledby="tk-title">
      <div className="section-head">
        <div><p className="label">04 / THE TOOLKIT</p><RevealTitle id="tk-title" text="What he|builds *with.*" /></div>
        <p className="section-note">Mostly Next.js and TypeScript on the front, Supabase or Node on the back, and a lot of Liquid.</p>
      </div>
      <div className="tk-grid">
        {founder.skills.map((g) => (
          <div className="tk-col" key={g.category}>
            <h3 className="label">{g.category.toUpperCase()}</h3>
            <ul>{g.items.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/** Live sites he built, as tilting cards that lead to the studio's showroom. */
export function FounderWork() {
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return
    const el = e.currentTarget, r = el.getBoundingClientRect()
    gsap.to(el, { rotateY: ((e.clientX - r.left) / r.width - 0.5) * 10, rotateX: -((e.clientY - r.top) / r.height - 0.5) * 10, duration: 0.6, ease: "power3" })
  }
  const reset = (e: React.PointerEvent<HTMLElement>) => gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "expo.out" })
  return (
    <section className="fw" aria-labelledby="fw-title">
      <div className="section-head">
        <div><p className="label">05 / LIVE IN PRODUCTION</p><RevealTitle id="fw-title" text="Things he’s|*shipped.*" /></div>
        <p className="section-note">Browse each of them, desktop and phone, in the studio’s showroom.</p>
      </div>
      <Reveal className="fw-grid">
        {sites.map((s) => (
          <a key={s.slug} href={s.liveUrl} target="_blank" rel="noreferrer" className="fw-card" onPointerMove={tilt} onPointerLeave={reset} data-cursor="Visit">
            <span className="win-bar"><span className="dots" aria-hidden><i /><i /><i /></span><span className="addr">{hostOf(s.liveUrl)}</span></span>
            <span className="fw-img"><img src={s.cover} alt={`${s.title} homepage, built by Osayeed Zaber`} width={1440} height={900} loading="lazy" /></span>
            <span className="fw-meta"><span className="fw-title">{s.title}</span><span className="label">{s.category.toUpperCase()}</span></span>
          </a>
        ))}
      </Reveal>
      <div className="fw-more"><a href="/#work" className="text-link">Open the showroom <span aria-hidden>→</span></a></div>
    </section>
  )
}

/** Closing call to action. */
/** Straight answers to what people search for. Native details/summary: works without JS and with a keyboard. */
export function FounderFaq() {
  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="section-head">
        <div><p className="label">06 / QUICK ANSWERS</p><RevealTitle id="faq-title" text="Asked|*often.*" /></div>
        <p className="section-note">The short version, for anyone who searched the name.</p>
      </div>
      <Reveal className="faq-list">
        {faq.map((f, i) => (
          <details key={f.q} className="faq-item" open={i === 0}>
            <summary><span className="label">{String(i + 1).padStart(2, "0")}</span><h3>{f.q}</h3><span className="faq-plus" aria-hidden /></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </Reveal>
    </section>
  )
}

export function FounderContact() {
  return (
    <section className="contact fc" aria-labelledby="fc-title">
      <p className="label">07 / SAY HELLO</p>
      <RevealTitle id="fc-title" className="ct-title" text="Let’s build|*something.*" />
      <div className="ct-grid">
        <p className="ct-lede">Email is the fastest way to reach him. New businesses, better storefronts, and ideas that are ready to be built.</p>
        <div className="fc-links">
          <Magnetic strength={0.2}><a href={`mailto:${founder.email}?subject=Hello%20Osayeed`} className="ct-mail" data-cursor="Write">{founder.email}<span aria-hidden>↗</span></a></Magnetic>
          <a href="/#contact" className="text-link">Or send a project brief <span aria-hidden>→</span></a>
        </div>
      </div>
    </section>
  )
}
