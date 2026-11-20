"use client"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }
export const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

type ReadyWindow = Window & { __ozReady?: boolean }

/** Fired once the intro has cleared, so the hero can play its entrance. */
export const READY = "oz:ready"
export function onReady(fn: () => void) {
  if ((window as ReadyWindow).__ozReady) fn()
  else window.addEventListener(READY, fn, { once: true })
}
export function markReady() {
  ;(window as ReadyWindow).__ozReady = true
  window.dispatchEvent(new Event(READY))
}
