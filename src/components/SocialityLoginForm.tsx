import { useState } from 'react'
import type { FormEvent } from 'react'
import type { LoginPayload } from '../types/sociality'

type Props = {
  isPending: boolean
  errorMessage?: string
  onSubmit: (payload: LoginPayload) => void
}

// Komponen ini hanya mengurus tampilan dan validasi ringan.
// Request login nanti ditulis di lesson 08 atau file API saat live coding.
export default function SocialityLoginForm({ isPending, errorMessage, onSubmit }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email.trim() || !password) return
    onSubmit({ email: email.trim(), password })
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <h3>Masuk ke Sociality</h3>
      <label>
        Email
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          disabled={isPending}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label>
        Kata sandi
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          disabled={isPending}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <button disabled={isPending}>{isPending ? 'Masuk…' : 'Masuk'}</button>
    </form>
  )
}
