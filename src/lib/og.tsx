import { ImageResponse } from "next/og"

export const ogSize = { width: 1200, height: 630 }

/** One black share card for every page: a label, a big two-line title, and the studio mark. */
export function ogCard({ label, line1, line2, foot }: { label: string; line1: string; line2: string; foot: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#000", color: "#f2f2f2", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 4, color: "#bdbdbd" }}>
          <span>{label}</span>
          <span>OZSTUDIO.CC</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 140, fontWeight: 700, letterSpacing: -6, lineHeight: 0.95 }}>
          <span>{line1}</span>
          <span style={{ color: "#999", fontStyle: "italic", fontWeight: 400 }}>{line2}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #282828", paddingTop: 28, fontSize: 24, color: "#bdbdbd" }}>
          <span>{foot}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 14, color: "#fff", fontSize: 40, fontWeight: 800, letterSpacing: -2 }}>
            OZ<span style={{ width: 8, height: 8, borderRadius: 8, background: "#fff" }} />
          </span>
        </div>
      </div>
    ),
    ogSize,
  )
}
