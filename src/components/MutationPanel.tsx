import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ProductMutationResponse, ProductPayload } from '../types/product'

export function SimulationBanner() {
  return (
    <aside className="notice">
      <strong>Mutation adalah simulasi.</strong> DummyJSON tidak menyimpan POST, PUT, atau
      DELETE. Respons ditampilkan terpisah. GET berikutnya mengambil kondisi server yang
      tetap sama; ini bukan bug React Query. ID hasil POST tidak digunakan untuk edit atau
      hapus.
    </aside>
  )
}

// Komponen presentasi saja: useMutation tetap terlihat di file lesson.
export function ProductForm({
  initialTitle = '',
  initialPrice = '',
  pending,
  submitLabel,
  onSubmit,
}: {
  initialTitle?: string
  initialPrice?: string
  pending: boolean
  submitLabel: string
  onSubmit: (payload: ProductPayload) => void
}) {
  const [title, setTitle] = useState(initialTitle)
  const [price, setPrice] = useState(initialPrice)
  const [error, setError] = useState('')
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const numericPrice = Number(price)
    if (
      !title.trim() ||
      !price.trim() ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      setError('Nama wajib diisi dan harga harus berupa angka positif.')
      return
    }
    setError('')
    onSubmit({ title: title.trim(), price: numericPrice })
  }
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <label>
        Nama produk
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={pending}
        />
      </label>
      <label>
        Harga (USD)
        <input
          type="number"
          min="0.01"
          step="any"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          disabled={pending}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button disabled={pending} type="submit">
        {pending ? 'Mengirim…' : submitLabel}
      </button>
    </form>
  )
}
export function MutationResponse({
  data,
  error,
  pending,
}: {
  data?: ProductMutationResponse
  error: Error | null
  pending: boolean
}) {
  return (
    <section aria-live="polite" className="min-w-0 space-y-2">
      <h3>Respons server</h3>
      {pending && <p>Mengirim mutation / menunggu invalidation selesai…</p>}
      {error && (
        <p role="alert">
          Mutation gagal: {error.message}. Periksa koneksi dan kirim ulang dari tombol
          aksi.
        </p>
      )}
      {data && (
        <>
          <p>Mutation berhasil. Respons ini bukan daftar GET yang tersimpan.</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
      {!data && !error && !pending && <p>Belum ada respons mutation.</p>}
    </section>
  )
}
