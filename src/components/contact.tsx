"use client"
import { useRef, useState } from "react"
import { gsap, useGSAP, prefersReduced } from "./motion"
import { Magnetic } from "./magnetic"
import { email } from "@/data/studio"

const kinds = ["Website", "Shopify store", "Portal / dashboard", "Something else"]

/** A giant headline that scales into place, and a short brief that opens a ready-written email. */
export function Contact() {
  const root = useRef<HTMLElement>(null)
  const [kind, setKind] = useState<string[]>([])
  useGSAP(() => {
    if (prefersReduced()) return
    gsap.from(".ct-title .line > span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".ct-title", start: "top 85%", once: true } })
    gsap.fromTo(".ct-title", { scale: 0.86 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 20%", scrub: 1 } })
  }, { scope: root })

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = [`Hi Osayeed,`, ``, String(f.get("message") || ""), ``, kind.length ? `Looking for: ${kind.join(", ")}` : "", `— ${f.get("name") || ""}`].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n")
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("OZ Studio project enquiry")}&body=${encodeURIComponent(body)}`
  }

  return (
    <section ref={root} id="contact" className="contact" aria-labelledby="ct-title">
      <p className="label">06 / THE NEXT THING STARTS HERE</p>
      <h2 id="ct-title" className="ct-title" aria-label="Something on your mind?">
        <span className="line" aria-hidden><span>Something</span></span>
        <span className="line" aria-hidden><span>on your <span className="serif">mind?</span></span></span>
      </h2>
      <div className="ct-grid">
        <div>
          <p className="ct-lede">A new business. A better storefront. An idea you’re ready to build. Let’s talk.</p>
          <Magnetic strength={0.2}><a href={`mailto:${email}?subject=OZ%20Studio%20project%20enquiry`} className="ct-mail" data-cursor="Write">{email}<span aria-hidden>↗</span></a></Magnetic>
        </div>
        <form className="ct-form" onSubmit={submit}>
          <fieldset>
            <legend className="label">WHAT ARE WE MAKING?</legend>
            <div className="ct-kinds">
              {kinds.map((k) => (
                <label key={k} className="chip-toggle">
                  <input type="checkbox" checked={kind.includes(k)} onChange={() => setKind((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]))} />
                  <span>{k}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="field"><span className="label">YOUR NAME</span><input name="name" autoComplete="name" required /></label>
          <label className="field"><span className="label">TELL ME ABOUT IT</span><textarea name="message" rows={3} required /></label>
          <button className="btn btn-light" type="submit"><span className="btn-fill" />Write the email <span aria-hidden>↗</span></button>
          <p className="ct-note">Opens your email app with the brief filled in. Nothing is stored here.</p>
        </form>
      </div>
    </section>
  )
}
