import axios from "axios";
import {type ProductMutationResponse, type ProductPayload,  type ProductsResponse } from "../types/product";

const api = axios.create({baseURL:'https://dummyjson.com', timeout:15000})


export async function getProducts(limit = 6, skip = 0, signal?:AbortSignal) {
    const response = await api.get<ProductsResponse>('/products', {
        params:{limit, skip, select:'title,price', delay:500},
        signal,
    })
    return response.data
}

export async function createProduct(payload: ProductPayload) {
    const response = await api.post<ProductMutationResponse>("products/add", payload)
    return response.data
}   