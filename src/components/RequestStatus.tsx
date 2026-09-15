type Props = {
  isPending: boolean
  isFetching: boolean
  error: Error | null
  hasData: boolean
  isEmpty?: boolean
  showSuccess?: boolean
  onRetry: () => void
}
export default function RequestStatus({
  isPending,
  isFetching,
  error,
  hasData,
  isEmpty,
  onRetry,
  showSuccess = true,
}: Props) {
  return (
    <div aria-live="polite" className="space-y-2">
      {isPending && <p role="status">Memuat data awal…</p>}
      {error && (
        <div role="alert" className="notice">
          <p>
            {hasData
              ? 'Pembaruan gagal. Data sebelumnya tetap ditampilkan.'
              : 'Data gagal dimuat.'}{' '}
            {error.message}
          </p>
          <button onClick={onRetry} disabled={isFetching}>
            Coba lagi
          </button>
        </div>
      )}
      {hasData && isFetching && <p role="status">Mengambil data di latar belakang…</p>}
      {showSuccess && hasData && !isFetching && !error && (
        <p className="text-sm text-slate-500">Request berhasil.</p>
      )}
      {hasData && isEmpty && <p>Belum ada produk untuk permintaan ini.</p>}
    </div>
  )
}
