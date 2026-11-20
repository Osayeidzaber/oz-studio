"use client"
import { useRef } from "react"
import { gsap, useGSAP, prefersReduced } from "./motion"

/** Splits a heading into masked words that rise in on scroll. `|` breaks a line, `*word*` sets it in the serif. */
export function RevealTitle({ text, as: Tag = "h2", id, className }: { text: string; as?: "h1" | "h2"; id?: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useGSAP(() => {
    if (prefersReduced()) return
    gsap.from(ref.current!.querySelectorAll(".w > span"), {
      yPercent: 120, rotate: 5, duration: 1.2, ease: "expo.out", stagger: 0.05,
      scrollTrigger: { trigger: ref.current, start: "top 86%", once: true },
    })
  }, { scope: ref })
  return (
    <Tag ref={ref} id={id} className={className} aria-label={text.replace(/[*|]/g, (m) => (m === "|" ? " " : ""))}>
      {text.split("|").map((line, li) => (
        <span className="line" key={li} aria-hidden>
          {line.trim().split(" ").map((w, wi) => (
            <span className="w" key={wi}>
              <span className={w.startsWith("*") ? "serif" : undefined}>{w.replace(/\*/g, "")}</span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

/** Lifts its children in, staggered, on scroll. */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    if (prefersReduced()) return
    gsap.from(ref.current!.children, { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ref.current, start: "top 88%", once: true } })
  }, { scope: ref })
  return <div ref={ref} className={className}>{children}</div>
}
