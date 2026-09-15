export type Product = { id: number; title: string; price: number }
export type ProductsResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}
export type ProductPayload = { title: string; price: number }
export type ProductMutationResponse = Product & {
  isDeleted?: boolean
  deletedOn?: string
}
