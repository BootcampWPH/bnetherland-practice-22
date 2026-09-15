import { useState } from "react";
import RequestStatus from "../../components/RequestStatus";
import { Query, useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/productsApi";
import ProductCard from "../../components/ProductCard";
import LessonLayout from "../../components/LessonLayout";

function ProductList({mode}: {mode:string}) {
    const[shouldFail, setShowFail] = useState(mode === "error")

    const query = useQuery({
        queryKey:['products', 'first', mode],
        queryFn:({signal}) => {
            if (shouldFail)
                throw new Error('Simulasi error kelas. Matikan simulasi lalu coba lagi.')
              return getProducts(6, mode === 'empty' ? 1000000 : 0, signal)
            },
          })
    return(
        <>
        <p className="text-sm">Mode kosong mengirim GET dengan skip. Mode Error sengaja error sebelum HTTP</p>
        <label className="flex items-center gap-2">
            <input type="checkbox" checked ={shouldFail} onChange={(event) => setShowFail(event.target.checked)} />
            Simulasikan kegagalan request
        </label>


        <button onClick={() => void query.refetch()} disabled={query.isFetching}>Refresh</button>


        <RequestStatus 
        isPending ={query.isPending} isFetching={query.isFetching} error={query.error} hasData={!!query.data} isEmpty={query.data?.products.length === 0} onRetry={() => void query.refetch} />

        <div className="product-grid">{query.data?.products.map((product) => (
            <ProductCard key={product.id} product={product}/>
        ))}
        
        </div>
        </>
    )
}

export default function FirstQueryLesson() {
    const [mode, setMode] = useState('normal')
    return (
      <LessonLayout
        title="02 — useQuery pertama"
        goal="Membaca data dan merender status request."
        explanation="Urutannya: instalasi → QueryClient → Provider → getProducts → useQuery → render status. Key inti bisa ['products']; demo ini menambahkan identitas lesson dan skenario agar cache latihan terpisah."
        tasks={[
          'Pilih mode error, matikan simulasi, lalu klik Coba lagi.',
          'Pilih mode normal; aktifkan kegagalan dan klik Refresh. Data lama tetap ada.',
          'Pilih mode kosong untuk melihat empty state dari API.',
        ]}
        aha="Kita tidak perlu membuat state loading, error, dan products secara manual untuk request ini."
      >
        <label>
          Skenario
          <select value={mode} onChange={(event) => setMode(event.target.value)}>
            <option value="normal">Normal</option>
            <option value="error">Error awal</option>
            <option value="empty">Kosong</option>
          </select>
        </label>
        <ProductList key={mode} mode={mode} />
      </LessonLayout>
    )
  }
  
