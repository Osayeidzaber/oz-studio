"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { z } from "zod"
import { liveInvoicePreview, type LiveInvoiceFields } from "@/lib/invoice/live-preview"
import { invoiceDesigns, type InvoiceDesign } from "@/lib/invoice/designs"
import { invoiceEmail } from "@/lib/invoice/email"
import { currencySchema, displayDate, invoiceTotals, money, saveInvoice, type Business, type Currency, type Invoice, type StudioData } from "@/lib/invoice/schema"
import { download, loadStudio, parseBackup, saveStudio } from "@/lib/invoice/store"

const LOGO_URL = "https://ozstudio.cc/logo-email.png"
const currencies = currencySchema.options

type Fields = LiveInvoiceFields & { id?: string }
type Mail = { subject: string; message: string; theme: "paper" | "dark" }

const isoToday = () => new Date().toISOString().slice(0, 10)
const addDays = (iso: string, days: number) => new Date(Date.parse(`${iso}T12:00:00Z`) + days * 864e5).toISOString().slice(0, 10)
const minorToText = (value: number) => (value / 100).toFixed(2).replace(/\.00$/, "")

function blankFields(data: StudioData, today: string): Fields {
  return {
    title: "", number: `OZ-${String(data.nextInvoice).padStart(4, "0")}`,
    design: (data.settings.defaultDesign ?? "noir") as InvoiceDesign,
    issueDate: today, dueDate: addDays(today, 14), currency: data.settings.currency,
    client: { name: "", company: "", email: "", address: "" },
    items: [{ description: "", quantity: "1", price: "" }],
    discount: "0", tax: "0", notes: data.settings.invoiceNote,
    styling: { showRates: data.settings.defaultShowRates ?? true, footer: "" },
  }
}

function fieldsFromInvoice(inv: Invoice): Fields {
  return {
    id: inv.status === "draft" ? inv.id : undefined,
    title: inv.title, number: inv.number, design: (inv.design ?? "signature") as InvoiceDesign,
    issueDate: inv.issueDate, dueDate: inv.dueDate, currency: inv.currency, client: { ...inv.client },
    items: inv.items.map((i) => ({ description: i.description, quantity: String(i.quantity), price: minorToText(i.unitPrice) })),
    discount: minorToText(inv.discount), tax: minorToText(inv.taxBasisPoints), notes: inv.notes,
    styling: inv.styling ?? { showRates: true, footer: "" },
  }
}

const firstError = (error: unknown) => error instanceof z.ZodError ? error.issues[0]?.message ?? "Check the form." : error instanceof Error ? error.message : "Something went wrong."

/**
 * The invoice desk. Everything happens in this browser: the PDF is drawn with pdf-lib,
 * the email is a ready HTML document to copy into any mail client, and saved invoices
 * stay in local storage.
 */
export function InvoiceDesk() {
  const [data, setData] = useState<StudioData | null>(null)
  const [fields, setFields] = useState<Fields | null>(null)
  const [today, setToday] = useState("")
  const [mail, setMail] = useState<Mail>({ subject: "", message: "", theme: "paper" })
  const [tab, setTab] = useState<"pdf" | "email" | "code">("pdf")
  const [panel, setPanel] = useState<"invoice" | "settings" | "saved">("invoice")
  const [pdfUrl, setPdfUrl] = useState("")
  const [pdfError, setPdfError] = useState("")
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState("")
  const toastTimer = useRef<number>(undefined)

  useEffect(() => {
    const d = loadStudio()
    const t = isoToday()
    setData(d); setToday(t); setFields(blankFields(d, t))
    setMail((m) => ({ ...m, theme: d.settings.defaultEmailTheme ?? "paper" }))
  }, [])

  const say = useCallback((text: string) => {
    setToast(text)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(""), 3200)
  }, [])

  const commit = useCallback((next: StudioData) => {
    setData(next)
    const problem = saveStudio(next)
    if (problem) say(problem)
  }, [say])

  const preview = useMemo(() => (fields && data ? liveInvoicePreview(fields, data.settings, today) : null), [fields, data, today])
  const invoice = preview?.invoice
  const totals = useMemo(() => { try { return invoice ? invoiceTotals(invoice) : null } catch { return null } }, [invoice])
  const subject = mail.subject || (invoice ? `${invoice.business.name} — Invoice ${invoice.number}${invoice.title ? `: ${invoice.title}` : ""}` : "")
  const email = useMemo(() => {
    if (!invoice || !preview?.calculationsReady) return null
    try { return invoiceEmail(invoice, invoice.business.email, LOGO_URL, { subject, message: mail.message, theme: mail.theme }) } catch { return null }
  }, [invoice, preview?.calculationsReady, subject, mail.message, mail.theme])

  // Redraw the PDF shortly after typing stops.
  useEffect(() => {
    if (!invoice || !preview?.calculationsReady) return
    let cancelled = false
    const timer = window.setTimeout(async () => {
      try {
        const { invoicePdf } = await import("@/lib/invoice/pdf")
        const bytes = await invoicePdf(invoice)
        if (cancelled) return
        const url = URL.createObjectURL(new Blob([bytes.slice()], { type: "application/pdf" }))
        setPdfUrl((old) => { if (old) URL.revokeObjectURL(old); return url })
        setPdfError("")
      } catch (error) { if (!cancelled) setPdfError(firstError(error)) }
    }, 450)
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [invoice, preview?.calculationsReady])

  if (!data || !fields || !invoice) return <div className="desk-loading label">Opening the invoice desk…</div>

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => setFields((f) => (f ? { ...f, [key]: value } : f))
  const setClient = (key: keyof Fields["client"], value: string) => setFields((f) => (f ? { ...f, client: { ...f.client, [key]: value } } : f))
  const setItem = (i: number, key: "description" | "quantity" | "price", value: string) => setFields((f) => (f ? { ...f, items: f.items.map((it, j) => (j === i ? { ...it, [key]: value } : it)) } : f))
  const setSettings = (patch: Partial<Business>) => commit({ ...data, settings: { ...data.settings, ...patch } })

  const fileName = (ext: string) => `${invoice.number}${invoice.client.company || invoice.client.name ? `-${(invoice.client.company || invoice.client.name).replace(/[^\w]+/g, "-")}` : ""}.${ext}`.replace(/-+/g, "-")

  async function makePdf(): Promise<Uint8Array | null> {
    if (!preview?.calculationsReady) { say("Fix the amounts first: quantities must be whole numbers and prices like 2000 or 2,000.50."); return null }
    setBusy(true)
    try { const { invoicePdf } = await import("@/lib/invoice/pdf"); return await invoicePdf(invoice!) }
    catch (error) { say(firstError(error)); return null }
    finally { setBusy(false) }
  }
  async function downloadPdf() {
    const bytes = await makePdf()
    if (bytes) { download(fileName("pdf"), bytes.slice(), "application/pdf"); say("PDF downloaded.") }
  }
  async function copyRich() {
    if (!email) return
    try {
      await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([email.html], { type: "text/html" }), "text/plain": new Blob([email.text], { type: "text/plain" }) })])
      say("Email copied. Paste it into a new Gmail or Outlook message, then attach the PDF.")
    } catch { say("This browser blocked rich copy. Use Copy HTML instead.") }
  }
  async function copyText(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); say(`${label} copied.`) } catch { say("Copy was blocked. Select the text and copy it by hand.") }
  }
  function save() {
    const next: StudioData = structuredClone(data!)
    try {
      const saved = saveInvoice(next, {
        id: fields!.id, client: invoice!.client, title: invoice!.title, design: invoice!.design, styling: invoice!.styling,
        number: invoice!.number, issueDate: invoice!.issueDate, dueDate: invoice!.dueDate, currency: invoice!.currency,
        items: invoice!.items, discount: invoice!.discount, taxBasisPoints: invoice!.taxBasisPoints, notes: invoice!.notes,
      }, crypto.randomUUID(), new Date().toISOString())
      commit(next)
      setFields((f) => (f ? { ...f, id: saved.id } : f))
      say(`Saved ${saved.number}.`)
    } catch (error) { say(firstError(error)) }
  }
  function startNew() {
    setFields(blankFields(data!, today))
    setMail((m) => ({ subject: "", message: "", theme: m.theme }))
    setPanel("invoice")
  }
  function setStatus(id: string, status: Invoice["status"]) {
    const next = structuredClone(data!)
    const inv = next.invoices.find((i) => i.id === id)
    if (!inv) return
    inv.status = status
    if (status === "paid") inv.paidAt = new Date().toISOString()
    commit(next)
  }
  function remove(id: string) {
    const inv = data!.invoices.find((i) => i.id === id)
    if (!inv || !window.confirm(`Delete ${inv.number} from this browser? This cannot be undone unless you have a backup.`)) return
    commit({ ...data!, invoices: data!.invoices.filter((i) => i.id !== id), archivedNumbers: [...(data!.archivedNumbers ?? []), inv.number] })
    if (fields!.id === id) startNew()
  }
  async function importBackup(file: File) {
    try {
      const incoming = parseBackup(await file.text())
      if (!window.confirm(`Replace the ${data!.invoices.length} invoice(s) in this browser with the ${incoming.invoices.length} in the backup?`)) return
      commit(incoming); setFields(blankFields(incoming, today)); say("Backup restored.")
    } catch (error) { say(firstError(error)) }
  }

  const ready = preview?.calculationsReady
  const sorted = [...data.invoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="desk">
      <header className="desk-top">
        <a href="/" className="wordmark">OZ<i className="dot" /><span>INVOICES</span></a>
        <nav className="desk-tabs" aria-label="Desk">
          {(["invoice", "saved", "settings"] as const).map((p) => (
            <button key={p} aria-pressed={panel === p} onClick={() => setPanel(p)}>{p === "invoice" ? "Invoice" : p === "saved" ? `Saved (${data.invoices.length})` : "Studio details"}</button>
          ))}
        </nav>
        <button className="btn btn-light" onClick={startNew}><span className="btn-fill" />New invoice</button>
      </header>

      <div className="desk-body">
        <section className="desk-form" aria-label="Editor">
          {panel === "invoice" && (
            <>
              <fieldset>
                <legend className="label">INVOICE</legend>
                <div className="grid2">
                  <Field label="Number"><input value={fields.number} onChange={(e) => set("number", e.target.value)} /></Field>
                  <Field label="Currency"><select value={fields.currency} onChange={(e) => set("currency", e.target.value as Currency)}>{currencies.map((c) => <option key={c}>{c}</option>)}</select></Field>
                </div>
                <Field label="Title"><input value={fields.title} placeholder="Website design and build" onChange={(e) => set("title", e.target.value)} /></Field>
                <div className="grid2">
                  <Field label="Issued"><input type="date" value={fields.issueDate} onChange={(e) => set("issueDate", e.target.value)} /></Field>
                  <Field label="Due"><input type="date" value={fields.dueDate} onChange={(e) => set("dueDate", e.target.value)} /></Field>
                </div>
              </fieldset>

              <fieldset>
                <legend className="label">BILL TO</legend>
                <div className="grid2">
                  <Field label="Name"><input value={fields.client.name} autoComplete="off" onChange={(e) => setClient("name", e.target.value)} /></Field>
                  <Field label="Company"><input value={fields.client.company} autoComplete="off" onChange={(e) => setClient("company", e.target.value)} /></Field>
                </div>
                <Field label="Email"><input type="email" value={fields.client.email} autoComplete="off" onChange={(e) => setClient("email", e.target.value)} /></Field>
                <Field label="Address"><textarea rows={2} value={fields.client.address} onChange={(e) => setClient("address", e.target.value)} /></Field>
              </fieldset>

              <fieldset>
                <legend className="label">SERVICES</legend>
                <div className="items">
                  {fields.items.map((it, i) => (
                    <div className="item" key={i}>
                      <input aria-label={`Item ${i + 1} description`} placeholder="Description" value={it.description} onChange={(e) => setItem(i, "description", e.target.value)} />
                      <input aria-label={`Item ${i + 1} quantity`} inputMode="numeric" value={it.quantity} onChange={(e) => setItem(i, "quantity", e.target.value)} />
                      <input aria-label={`Item ${i + 1} unit price`} inputMode="decimal" placeholder="0.00" value={it.price} onChange={(e) => setItem(i, "price", e.target.value)} />
                      <button className="icon-btn" aria-label={`Remove item ${i + 1}`} disabled={fields.items.length === 1} onClick={() => set("items", fields.items.filter((_, j) => j !== i))}>×</button>
                    </div>
                  ))}
                </div>
                <button className="ghost" disabled={fields.items.length >= 20} onClick={() => set("items", [...fields.items, { description: "", quantity: "1", price: "" }])}>+ Add a line</button>
                <div className="grid2">
                  <Field label={`Discount (${fields.currency})`}><input inputMode="decimal" value={fields.discount} onChange={(e) => set("discount", e.target.value)} /></Field>
                  <Field label="Tax %"><input inputMode="decimal" value={fields.tax} onChange={(e) => set("tax", e.target.value)} /></Field>
                </div>
                <div className="totals" aria-live="polite">
                  {totals && ready ? (
                    <><span>Subtotal {money(totals.subtotal, invoice.currency)}</span><strong>{money(totals.total, invoice.currency)}</strong></>
                  ) : <span className="warn">Amounts need fixing: whole quantities, prices like 2000 or 2,000.50, discount no more than the subtotal.</span>}
                </div>
              </fieldset>

              <fieldset>
                <legend className="label">LOOK</legend>
                <div className="designs" role="radiogroup" aria-label="PDF design">
                  {invoiceDesigns.map((d) => (
                    <button key={d.id} role="radio" aria-checked={fields.design === d.id} className={`design ${d.dark ? "is-dark" : ""}`} onClick={() => set("design", d.id)}>
                      <span className="design-swatch" aria-hidden />
                      <span>{d.name}</span>
                      <span className="label">{d.mood}</span>
                    </button>
                  ))}
                </div>
                <label className="check"><input type="checkbox" checked={fields.styling?.showRates !== false} onChange={(e) => set("styling", { footer: fields.styling?.footer ?? "", showRates: e.target.checked })} /> Show quantity × rate on each line</label>
                <Field label="Notes"><textarea rows={3} value={fields.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
                <Field label="Footer line"><input value={fields.styling?.footer ?? ""} maxLength={140} onChange={(e) => set("styling", { showRates: fields.styling?.showRates ?? true, footer: e.target.value })} /></Field>
              </fieldset>

              <fieldset>
                <legend className="label">EMAIL</legend>
                <Field label="Subject"><input value={subject} onChange={(e) => setMail({ ...mail, subject: e.target.value.replace(/[\r\n]/g, " ") })} /></Field>
                <Field label="Personal message (optional)"><textarea rows={3} value={mail.message} placeholder="Great working with you on this." onChange={(e) => setMail({ ...mail, message: e.target.value })} /></Field>
                <div className="seg" role="group" aria-label="Email theme">
                  <button aria-pressed={mail.theme === "paper"} onClick={() => setMail({ ...mail, theme: "paper" })}>Light email</button>
                  <button aria-pressed={mail.theme === "dark"} onClick={() => setMail({ ...mail, theme: "dark" })}>Dark email</button>
                </div>
              </fieldset>

              <div className="desk-actions">
                <button className="btn btn-light" onClick={downloadPdf} disabled={busy}><span className="btn-fill" />{busy ? "Drawing…" : "Download PDF"}</button>
                <button className="pill" onClick={copyRich} disabled={!email}>Copy email</button>
                <button className="pill" onClick={save}>{fields.id ? "Save changes" : "Save invoice"}</button>
              </div>
            </>
          )}

          {panel === "saved" && (
            <div className="saved">
              {sorted.length === 0 && <p className="muted">No saved invoices in this browser yet. Make one and press Save invoice.</p>}
              {sorted.map((inv) => {
                let total = ""
                try { total = money(invoiceTotals(inv).total, inv.currency) } catch {}
                return (
                  <article key={inv.id} className="saved-row">
                    <button className="saved-main" onClick={() => { setFields(fieldsFromInvoice(inv)); setPanel("invoice") }}>
                      <span className="label">{inv.number} · {displayDate(inv.issueDate).toUpperCase()}</span>
                      <strong>{inv.client.company || inv.client.name}</strong>
                      <span className="muted">{inv.title}</span>
                    </button>
                    <span className="saved-total">{total}</span>
                    <select aria-label={`Status of ${inv.number}`} value={inv.status} onChange={(e) => setStatus(inv.id, e.target.value as Invoice["status"])}>
                      <option value="draft">Draft</option><option value="issued">Sent</option><option value="paid">Paid</option><option value="void">Void</option>
                    </select>
                    <button className="icon-btn" aria-label={`Duplicate ${inv.number}`} title="Duplicate as a new invoice" onClick={() => { setFields({ ...fieldsFromInvoice(inv), id: undefined, number: `OZ-${String(data.nextInvoice).padStart(4, "0")}`, issueDate: today, dueDate: addDays(today, 14) }); setPanel("invoice") }}>⧉</button>
                    <button className="icon-btn" aria-label={`Delete ${inv.number}`} onClick={() => remove(inv.id)}>×</button>
                  </article>
                )
              })}
              <div className="desk-actions">
                <button className="pill" onClick={() => download(`oz-invoices-${today}.json`, JSON.stringify(data, null, 2), "application/json")}>Export backup</button>
                <label className="pill file-pill">Restore backup<input type="file" accept="application/json,.json" onChange={(e) => { const f = e.target.files?.[0]; if (f) importBackup(f); e.target.value = "" }} /></label>
              </div>
              <p className="muted small">Invoices are kept in this browser only. Export a backup now and then.</p>
            </div>
          )}

          {panel === "settings" && (
            <div className="settings">
              <fieldset>
                <legend className="label">ON EVERY INVOICE</legend>
                <Field label="Studio name"><input value={data.settings.name} onChange={(e) => setSettings({ name: e.target.value })} /></Field>
                <Field label="Reply-to email"><input type="email" value={data.settings.email} onChange={(e) => setSettings({ email: e.target.value })} /></Field>
                <Field label="Address"><textarea rows={2} value={data.settings.address} onChange={(e) => setSettings({ address: e.target.value })} /></Field>
                <div className="grid2">
                  <Field label="Default currency"><select value={data.settings.currency} onChange={(e) => setSettings({ currency: e.target.value as Currency })}>{currencies.map((c) => <option key={c}>{c}</option>)}</select></Field>
                  <Field label="Default design"><select value={data.settings.defaultDesign ?? "noir"} onChange={(e) => setSettings({ defaultDesign: e.target.value as InvoiceDesign })}>{invoiceDesigns.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
                </div>
                <Field label="Default note"><textarea rows={2} value={data.settings.invoiceNote} onChange={(e) => setSettings({ invoiceNote: e.target.value })} /></Field>
              </fieldset>
              <fieldset>
                <legend className="label">HOW TO PAY</legend>
                {(data.settings.paymentMethods ?? []).map((m, i) => (
                  <div className="method" key={i}>
                    <input aria-label="Method name" placeholder="bKash" value={m.name} onChange={(e) => setSettings({ paymentMethods: data.settings.paymentMethods!.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })} />
                    <textarea aria-label="Method details" rows={2} placeholder="Account number, name, reference" value={m.details} onChange={(e) => setSettings({ paymentMethods: data.settings.paymentMethods!.map((x, j) => (j === i ? { ...x, details: e.target.value } : x)) })} />
                    <button className="icon-btn" aria-label="Remove method" onClick={() => setSettings({ paymentMethods: data.settings.paymentMethods!.filter((_, j) => j !== i) })}>×</button>
                  </div>
                ))}
                <button className="ghost" disabled={(data.settings.paymentMethods?.length ?? 0) >= 5} onClick={() => setSettings({ paymentMethods: [...(data.settings.paymentMethods ?? []), { name: "", details: "" }] })}>+ Add a payment method</button>
                <Field label="Other payment instructions"><textarea rows={2} value={data.settings.paymentInstructions} onChange={(e) => setSettings({ paymentInstructions: e.target.value })} /></Field>
              </fieldset>
              <p className="muted small">Saved automatically in this browser. Changes apply to new and unsaved invoices; saved invoices keep the details they were made with.</p>
            </div>
          )}
        </section>

        <section className="desk-preview" aria-label="Preview">
          <div className="seg" role="tablist" aria-label="Preview">
            <button role="tab" aria-selected={tab === "pdf"} aria-pressed={tab === "pdf"} onClick={() => setTab("pdf")}>PDF</button>
            <button role="tab" aria-selected={tab === "email"} aria-pressed={tab === "email"} onClick={() => setTab("email")}>Email</button>
            <button role="tab" aria-selected={tab === "code"} aria-pressed={tab === "code"} onClick={() => setTab("code")}>HTML</button>
          </div>

          {tab === "pdf" && (
            <div className="sheet">
              {pdfError ? <p className="warn">{pdfError}</p> : pdfUrl ? <iframe title="Invoice PDF preview" src={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`} /> : <p className="muted">Drawing the PDF…</p>}
              {!ready && <p className="sheet-note warn">Preview paused until the amounts are valid.</p>}
            </div>
          )}

          {tab === "email" && (
            <div className="sheet mail">
              <div className="mail-head">
                <span className="label">TO</span><span>{invoice.client.email || "—"}</span>
                <span className="label">SUBJECT</span><span>{subject}</span>
              </div>
              {email ? <iframe title="Email preview" srcDoc={email.html} sandbox="" /> : <p className="warn">Fix the amounts to see the email.</p>}
            </div>
          )}

          {tab === "code" && (
            <div className="sheet code">
              {email ? <textarea readOnly value={email.html} aria-label="Email HTML source" onFocus={(e) => e.currentTarget.select()} /> : <p className="warn">Fix the amounts to see the HTML.</p>}
            </div>
          )}

          <div className="copy-bar">
            <button className="btn btn-light" onClick={copyRich} disabled={!email}><span className="btn-fill" />Copy email (paste into Gmail)</button>
            <button className="pill" onClick={() => email && copyText(email.html, "HTML")} disabled={!email}>Copy HTML</button>
            <button className="pill" onClick={() => copyText(subject, "Subject")}>Copy subject</button>
            <button className="pill" onClick={() => email && copyText(email.text, "Plain text")} disabled={!email}>Copy plain text</button>
            <button className="pill" onClick={() => email && download(fileName("html"), email.html, "text/html")} disabled={!email}>Download .html</button>
            <button className="pill" onClick={downloadPdf} disabled={busy}>Download PDF</button>
          </div>
          <p className="muted small">Copy email, paste it into a new message to {invoice.client.email || "the client"}, attach the PDF, and send.</p>
        </section>
      </div>

      <div className={`toast ${toast ? "is-on" : ""}`} role="status" aria-live="polite">{toast}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="field"><span className="label">{label.toUpperCase()}</span>{children}</label>
}
