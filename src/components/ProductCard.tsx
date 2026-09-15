import type { ReactNode } from 'react'
import type { Product } from '../types/product'
export default function ProductCard({
  product,
  children,
}: {
  product: Product
  children?: ReactNode
}) {
  return (
    <article
      className="rounded-xl border border-slate-200 p-4"
      data-testid="product-card"
    >
      <p className="text-sm text-slate-500">Produk #{product.id}</p>
      <h3>{product.title}</h3>
      <p className="my-3 font-semibold">
        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'USD' }).format(
          product.price,
        )}
      </p>
      {children}
    </article>
  )
}
