import { useState } from 'react'
import LessonLayout from '../../components/LessonLayout'
export default function ServerStateLesson() {

  const [title, setTitle] = useState('Produk Pilihan')
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <LessonLayout
      title="01 — Client state vs server state"
      goal="Membedakan pemilik data."
      explanation="Input, halaman terpilih, dan panel terbuka adalah client state. Daftar produk dari API adalah server state: bisa berubah di luar aplikasi kita."
      tasks={[
        'Ubah input tanpa mengirim request.',
        'Buka panel, lalu bedakan nilai lokal dengan data dari API.',
      ]}
      aha="Axios mengirim request, sedangkan React Query membantu mengelola data hasil request dan statusnya."
    >
    <label>
      Judul lokal
      <input value={title} onChange={(event) => setTitle(event.target.value) }/>
    </label>

    <p> Nilai useState: {title}</p>
    <button onClick={() => setIsOpen(!isOpen)} >
      {isOpen ? 'Tutup' : "Buka"} panel
    </button>
    </LessonLayout>
  )
}
