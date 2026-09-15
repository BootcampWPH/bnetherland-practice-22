import { useState } from 'react'
import { login } from '../api/socialityApi'
import type { SocialSession } from '../types/sociality'

// Disiapkan mentor: autentikasi pendukung, bukan fokus live coding lesson 08.
export default function SocialityLogin({
  onLogin,
}: {
  onLogin: (session: SocialSession) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  return (
    <form
      className="space-y-3"
      onSubmit={async (event) => {
        event.preventDefault()
        if (pending) return
        setPending(true)
        setError('')
        try {
          const session = await login({ email: email.trim(), password })
          setPassword('')
          onLogin(session)
        } catch {
          setError(
            'Login gagal. Periksa email, kata sandi, dan koneksi. Gunakan akun Sociality yang sudah terdaftar.',
          )
        } finally {
          setPending(false)
        }
      }}
    >
      <h3>Masuk untuk mencoba like</h3>
      <p className="text-sm">
        Daftar boleh dilihat tanpa login. Gunakan akun latihan sendiri; like dan unlike
        akan mengubah data server. Sesi hanya disimpan di memori dan hilang saat halaman
        dimuat ulang.
      </p>
      <label>
        Email
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          disabled={pending}
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
          disabled={pending}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button disabled={pending}>{pending ? 'Masuk…' : 'Masuk'}</button>
    </form>
  )
}
