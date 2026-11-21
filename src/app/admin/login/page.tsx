import type { Metadata } from "next"
import { LoginForm } from "./login-form"
import "../admin.css"

export const metadata: Metadata = {
  title: { absolute: "Sign in · OZ Studio" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function LoginPage() {
  return (
    <main className="login">
      <div className="login-mark" aria-hidden><img src="/logo.svg" alt="" width={520} height={520} /></div>
      <a href="/" className="wordmark login-home">OZ<i className="dot" /><span>STUDIO</span></a>
      <section className="login-card" aria-labelledby="login-title">
        <p className="label">PRIVATE / INVOICE DESK</p>
        <h1 id="login-title">Studio <span className="serif">desk.</span></h1>
        <p className="login-note">Invoices, PDFs and client emails. Only for the studio.</p>
        <LoginForm />
      </section>
      <p className="label login-foot"><a href="/">← Back to ozstudio.cc</a></p>
    </main>
  )
}
