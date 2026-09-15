import { useState } from "react";
import LessonLayout from "../../components/LessonLayout";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/productsApi";
import RequestStatus from "../../components/RequestStatus";
import ProductCard from "../../components/ProductCard";


export default function PaginationLesson(){
    const [page, setPage] = useState(1)
    const [keepData, setKeepData] = useState(false)
    const pageSize = 6

    const skip = (page-1) * pageSize

    const query = useQuery({
        queryKey:['products', 'list', {page, pageSize}],
        queryFn:({signal}) => getProducts(pageSize, skip, signal),
        placeholderData:keepData ? keepPreviousData : undefined
    })

    const totalPages = query.data ? Math.max(1, Math.ceil(query.data.total /pageSize)) : 1

    return (
    <LessonLayout
        title="04 — Pagination"
        goal="Memberi identitas berbeda untuk setiap halaman."
        explanation="page adalah client state. skip = (page - 1) × pageSize menentukan bagian data server. Query key memasukkan page dan pageSize; tidak perlu useEffect untuk fetch ulang."
        tasks={[
        'Pindah halaman dalam versi dasar.',
        'Aktifkan keepPreviousData dan pindah ke halaman yang belum dibuka.',
        'Amati limit, skip, dan key yang berubah.',
        ]}
        aha="Mengubah page mengubah query key, lalu React Query mengambil data untuk identitas halaman tersebut."
      >
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={keepData} onChange={(event) => setKeepData(event.target.checked)}/>
          Langkah 2 : gunakan keepPreviousData
          </label>
          <p>Halaman diminta: {page} . Total: {query.data?.total ?? "..."} - skip: {skip}</p>
          {query.isPlaceholderData && (
            <p className="notice">Data sementara masih dari halamanan sebelumnya</p>
          )}
          
          <RequestStatus 
          isPending={query.isPending}
          isFetching={query.isFetching}
          error={query.error}
          hasData={!!query.data}
          isEmpty={query.data?.products.length === 0}
          onRetry={() => void query.refetch()}
          />

         <div className="product-grid">{query.data?.products.map((product) => (
            <ProductCard key={product.id} product={product}/>
        ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setPage(page - 1)} disabled={page === 1 || query.isFetching}>Sebelumnnya</button>
            <span>Halaman {page} / {query.data ? totalPages : '...'}</span>
            <button onClick={() => setPage(page + 1)} disabled={!query.data|| page >= totalPages || query.isFetching || query.isPlaceholderData}>Berikutnya</button>
        </div>
      </LessonLayout>
    )
}