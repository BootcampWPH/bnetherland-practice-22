import { useMutation } from "@tanstack/react-query";
import { createProduct } from "../../api/productsApi";
import LessonLayout from "../../components/LessonLayout";
import { MutationResponse, ProductForm, SimulationBanner } from "../../components/MutationPanel";

export default function CreateMutationLesson() {
    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: (product) => {
            console.info('POST berhasil. ID Simulasi', product.id)
        }
    })

    return (
    <LessonLayout
      title="05 — POST dengan useMutation"
      goal="Mengirim perubahan dari aksi pengguna."
      explanation="useQuery membaca data. useMutation mengirim operasi perubahan. mutate dipanggil saat submit, bukan saat render; isPending mengunci tombol selama request."
      tasks={[
        'Kirim nama kosong atau harga negatif.',
        'Kirim produk valid dan lihat POST beserta payload di Network.',
        'Bandingkan respons POST dengan GET: produk baru tidak disimpan.',
      ]}
      aha="Mutation dipicu aksi pengguna. Status berhasil dan responsnya terpisah dari daftar produk."
    >



      <SimulationBanner />
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form mengirim payload yang sudah divalidasi: title string dan price number. */}
        <ProductForm
          pending={mutation.isPending}
          submitLabel="Kirim POST"
          onSubmit={(payload) => mutation.mutate(payload)}
        />
        {/* Respons mutation berdiri sendiri dan tidak disisipkan ke daftar GET. */}
        <MutationResponse
          data={mutation.data}
          error={mutation.error}
          pending={mutation.isPending}
        />



      </div>
    </LessonLayout>
    )
}