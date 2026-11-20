import { emptyStudio, studioSchema, type StudioData } from "./schema"

/**
 * Invoices live in this browser only. Nothing is uploaded; export a backup to move
 * them between machines.
 */
const KEY = "oz-studio-invoices-v1"

export function loadStudio(): StudioData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = studioSchema.safeParse(JSON.parse(raw))
      if (parsed.success) return parsed.data
    }
  } catch {}
  return emptyStudio()
}

export function saveStudio(data: StudioData): string | null {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
    return null
  } catch {
    return "This browser would not save the invoices (storage is full or blocked). Export a backup now."
  }
}

export function parseBackup(text: string): StudioData {
  const parsed = studioSchema.safeParse(JSON.parse(text))
  if (!parsed.success) throw new Error("That file is not an OZ Studio invoice backup.")
  return parsed.data
}

export function download(name: string, data: BlobPart, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }))
  const a = Object.assign(document.createElement("a"), { href: url, download: name })
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
