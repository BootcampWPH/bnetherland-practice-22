import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import RequestStatus from "../../components/RequestStatus"
import ProductCard from "../../components/ProductCard"
import { getProducts } from "../../api/productsApi"
import LessonLayout from "../../components/LessonLayout"



function ProductList() {

    const query = useQuery({
        queryKey:['products', 'cache'],
        queryFn:({signal}) => getProducts(3,0,signal),
        staleTime:5000,
    })

    return(
        <>
        <h3>ProductList</h3>
        <RequestStatus
          isPending ={query.isPending} 
          isFetching={query.isFetching} 
          error={query.error} 
          hasData={!!query.data} 
          isEmpty={query.data?.products.length === 0} 
          onRetry={() => void query.refetch} />

        <div className="product-grid">{query.data?.products.map((product) => (
            <ProductCard key={product.id} product={product}/>
        ))}
        </div>
        </>
    )
}


function ProductSummary(){
    const query = useQuery({
        queryKey:['products', 'cache'],
        queryFn:({signal}) => getProducts(3,0,signal),
        staleTime:5000,
    })

    return (
        <div className="notice">
            <h3>ProductSummary</h3>

            <p>
                {query.data
                ? `${query.data.products.length} produk dibaca dari query yang sama`
                : 'Menunggu data query.'
                }
            </p>

            {query.isStale ? 'Stale: boleh diperbarui.' : 'Fresh: belum dianggap usang'}
            {query.isFetching && 'Sedang mengambil data'}
        </div>
    )
}


export default function QueryKeyLesson() {
    // Hide/show digunakan untuk mendemonstrasikan mount dan unmount observer.
    const [visible, setVisible] = useState(true)
    return (
      <LessonLayout
        title="03 — Query key dan cache"
        goal="Membaca satu cache dari dua komponen."
        explanation="Query key adalah identitas data. Kedua komponen memakai key, request, dan staleTime yang sama tanpa oper data lewat props. Fresh 30 detik adalah konfigurasi kelas, bukan default. Stale bukan berarti data dihapus."
        tasks={[
          'Buka Network, lalu sembunyikan dan tampilkan kedua komponen dalam 30 detik.',
          'Ulangi setelah 30 detik: cache lama tampil sambil refetch.',
          'Amati key products/cache di Devtools.',
        ]}
        aha="Cache dapat dipakai bersama, tetapi bukan janji bahwa data tidak pernah di-fetch ulang."
      >
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'Sembunyikan' : 'Tampilkan'} komponen
        </button>
        {/* Saat fresh, remount dapat langsung memakai data dari cache. */}
        {visible && (
          <>
            <ProductList />
            <ProductSummary />
          </>
        )}
      </LessonLayout>
    )
  }
  