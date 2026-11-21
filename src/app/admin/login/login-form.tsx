"use client"
import { useActionState, useState } from "react"
import { login, type LoginState } from "./actions"

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {})
  const [show, setShow] = useState(false)
  return (
    <form action={action} className="login-form">
      <label className="login-field">
        <span className="label">PASSWORD</span>
        <span className="login-input">
          <input
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            autoFocus
            required
            aria-invalid={!!state.error}
            aria-describedby={state.error ? "login-error" : undefined}
          />
          <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show}>{show ? "Hide" : "Show"}</button>
        </span>
      </label>
      <p id="login-error" className="login-error" role="alert">{state.error ?? ""}</p>
      <button type="submit" className="login-submit" disabled={pending}>
        {pending ? "Checking…" : "Enter the desk"} <span aria-hidden>→</span>
      </button>
    </form>
  )
}
