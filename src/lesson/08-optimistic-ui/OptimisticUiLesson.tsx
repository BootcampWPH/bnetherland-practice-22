import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPosts, likePost, unlikePost } from '../../api/socialityApi'
import type { PostsPage, SocialSession } from '../../types/sociality'
import LessonLayout from '../../components/LessonLayout'
import SocialityLogin from '../../components/SocialityLogin'

type LikeInput = { postId: number; nextLiked: boolean; shouldFail: boolean }

function OptimisticPosts({ session }: { session: SocialSession | null }) {
  const [shouldFail, setShouldFail] = useState(false)
  const [feedback, setFeedback] = useState('Coba klik Suka pada salah satu postingan.')
  const queryClient = useQueryClient()
  const queryKey = ['sociality', 'posts', { userId: session?.user.id ?? null }]
  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => getPosts(session?.token, signal),
  })
  const mutation = useMutation({
    mutationFn: async ({ postId, nextLiked, shouldFail }: LikeInput) => {
      if (!session) throw new Error('Masuk dahulu untuk memberi like.')
      await new Promise((resolve) => setTimeout(resolve, 1500))
      if (shouldFail)
        throw new Error('Simulasi gagal sebelum request like/unlike dikirim.')
      return nextLiked
        ? 
          likePost(postId, session.token)
        : unlikePost(postId, session.token)
    },
    onMutate: async ({ postId, nextLiked }) => {
      // 1. Hentikan GET lama, lalu simpan snapshot untuk rollback.
      await queryClient.cancelQueries({ queryKey, exact: true })
      const previousData = queryClient.getQueryData<PostsPage>(queryKey)
      // 2. UI membaca perubahan sementara langsung dari cache Query.
      queryClient.setQueryData<PostsPage>(queryKey, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          posts: oldData.posts.map((post) => {
            // Hanya post yang diklik yang diubah; object lain tetap dipertahankan.
            if (post.id !== postId || post.likedByMe === nextLiked) return post
            return {
              ...post,
              likedByMe: nextLiked,
              likeCount: Math.max(0, post.likeCount + (nextLiked ? 1 : -1)),
            }
          }),
        }
      })
      setFeedback(
        'Optimistic: tombol dan jumlah suka sudah berubah, server belum mengonfirmasi.',
      )
      return { previousData }
    },
    onError: (_error, _input, onMutateResult) => {
      // 3. Rollback tidak perlu menunggu GET berhasil.
      if (onMutateResult?.previousData)
        queryClient.setQueryData(queryKey, onMutateResult.previousData)
      setFeedback('Rollback: mutation gagal, status dan jumlah suka dipulihkan.')
    },
    onSuccess: () => {
      setFeedback(
        'Server berhasil merespons. GET berikutnya memeriksa status suka yang tersimpan.',
      )
    },
    onSettled: async () => {
      // 4. Sukses maupun gagal: cocokkan lagi dengan server.
      await queryClient.invalidateQueries({ queryKey, exact: true })
    },
  })
  // Selama fetch atau mutation, semua tombol aksi ditahan agar snapshot tidak bertabrakan.
  const busy = query.isFetching || mutation.isPending
  return (
    <div className="space-y-4">
      <p className="notice">
        Sociality menyimpan like/unlike. Jeda lokal 1,5 detik membantu pengamatan.
        Simulasi gagal hanya melempar Error sebelum request perubahan; matikan untuk
        memakai API asli.
      </p>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={shouldFail}
          disabled={mutation.isPending || !session}
          onChange={(event) => setShouldFail(event.target.checked)}
        />
        Simulasikan mutation gagal
      </label>
      <button disabled={busy} onClick={() => void query.refetch()}>
        Refresh postingan
      </button>
      {query.isPending && <p role="status">Memuat postingan…</p>}
      {query.isFetching && query.data && (
        <p role="status">Memperbarui postingan di latar belakang…</p>
      )}
      {query.error && (
        <div role="alert">
          <p>
            {query.data
              ? 'Pembaruan gagal; data sebelumnya tetap tampil.'
              : 'Postingan gagal dimuat.'}{' '}
            {query.error.message}
          </p>
          <button disabled={busy} onClick={() => void query.refetch()}>
            Coba lagi
          </button>
        </div>
      )}
      {query.data?.posts.length === 0 && <p>Belum ada postingan.</p>}
      <p role="status">{feedback}</p>
      <div className="product-grid">
        {/* Kartu membaca cache Query langsung, termasuk nilai optimistis sementara. */}
        {query.data?.posts.map((post) => (
          <article
            key={post.id}
            className="card space-y-3"
            data-testid="social-post"
            data-post-id={post.id}
          >
            <h3>@{post.author.username}</h3>
            <p className="break-words">{post.caption || 'Tanpa caption'}</p>
            <p data-testid="like-count">{post.likeCount} suka</p>
            <button
              // aria-pressed juga membuat status toggle terbaca oleh screen reader dan tes.
              aria-pressed={post.likedByMe}
              disabled={!session || busy}
              onClick={() =>
                mutation.mutate({
                  postId: post.id,
                  nextLiked: !post.likedByMe,
                  shouldFail,
                })
              }
            >
              {post.likedByMe ? 'Batal suka' : 'Suka'}
            </button>
          </article>
        ))}
      </div>
      {!session && <p>Masuk di atas agar tombol Suka aktif.</p>}
      <ol className="list-decimal space-y-2 pl-5">
        <li>onMutate: cancelQueries → snapshot → setQueryData.</li>
        <li>mutationFn: POST untuk suka, DELETE untuk batal suka.</li>
        <li>onError: rollback jika gagal.</li>
        <li>onSettled: invalidateQueries untuk sinkronisasi.</li>
      </ol>
      <section className="min-w-0 space-y-2" aria-live="polite">
        <h3>Respons server</h3>
        {mutation.isPending && <p>Menunggu mutation dan sinkronisasi selesai…</p>}
        {mutation.error && (
          <p role="alert">
            {mutation.error.message} Matikan simulasi atau periksa sesi/koneksi, lalu klik
            tombol suka lagi.
          </p>
        )}
        {mutation.isSuccess && (
          <>
            <p>Mutation berhasil.</p>
            <pre>{JSON.stringify(mutation.data, null, 2)}</pre>
          </>
        )}
        {mutation.isIdle && <p>Belum ada mutation.</p>}
      </section>
    </div>
  )
}

export default function OptimisticUiLesson() {
  // Token hanya hidup di memori component, tidak masuk localStorage atau URL.
  const [session, setSession] = useState<SocialSession | null>(null)
  return (
    <LessonLayout
      title="08 — Optimistic UI dengan Sociality"
      goal="Membuat tombol Suka langsung merespons, dengan rollback jika gagal."
      explanation="Menunggu server bisa terasa lambat. Kita ubah status tombol dan jumlah suka lebih dahulu, simpan snapshot untuk pemulihan, lalu cocokkan lagi dengan server. Login hanya pendukung demo."
      tasks={[
        'Masuk dengan akun latihan, klik Suka, dan amati jumlah berubah sebelum request selesai.',
        'Aktifkan simulasi gagal lalu klik tombol; status dan jumlah kembali melalui rollback.',
        'Matikan simulasi, ulangi, lalu Refresh postingan untuk memeriksa status tersimpan.',
      ]}
      aha="UI boleh mendahului server, tetapi tetap perlu rollback dan sinkronisasi agar data dapat dipercaya."
    >
      {session ? (
        <p className="notice">
          Masuk sebagai @{session.user.username}. Untuk berganti akun, muat ulang halaman.
          Token tidak ditampilkan atau disimpan permanen.
        </p>
      ) : (
        <SocialityLogin onLogin={setSession} />
      )}
      {/* key mengganti cache observer ketika identitas pengguna berubah. */}
      <OptimisticPosts key={session?.user.id ?? 'guest'} session={session} />
    </LessonLayout>
  )
}
