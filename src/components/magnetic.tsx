"use client"
import { useEffect, useRef } from "react"
import { gsap } from "./motion"

/** Pulls its child toward the pointer while hovered. */
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const el = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = el.current!
    if (!window.matchMedia("(pointer: fine)").matches) return
    const x = gsap.quickTo(node, "x", { duration: 0.8, ease: "elastic.out(1, 0.45)" })
    const y = gsap.quickTo(node, "y", { duration: 0.8, ease: "elastic.out(1, 0.45)" })
    const move = (e: PointerEvent) => {
      const r = node.getBoundingClientRect()
      x((e.clientX - r.left - r.width / 2) * strength)
      y((e.clientY - r.top - r.height / 2) * strength)
    }
    const out = () => { x(0); y(0) }
    node.addEventListener("pointermove", move)
    node.addEventListener("pointerleave", out)
    return () => { node.removeEventListener("pointermove", move); node.removeEventListener("pointerleave", out) }
  }, [strength])
  return <span ref={el} className="magnetic">{children}</span>
}
