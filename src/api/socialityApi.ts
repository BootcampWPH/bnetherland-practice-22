import axios from 'axios'
import type {
  LikeResponse,
  LoginPayload,
  LoginResponse,
  PostsResponse,
} from '../types/sociality'

const api = axios.create({
  baseURL: 'https://be-social-media-api-production.up.railway.app/api',
  timeout: 15000,
})

export async function login(payload: LoginPayload) {
  const response = await api.post<LoginResponse>('/auth/login', payload)
  return response.data.data
}

export async function getPosts(token?: string, signal?: AbortSignal) {
  const response = await api.get<PostsResponse>('/posts', {
    params: { page: 1, limit: 3 },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    signal,
  })
  return response.data.data
}

export async function likePost(id: number, token: string) {
  const response = await api.post<LikeResponse>(`/posts/${id}/like`, undefined, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function unlikePost(id: number, token: string) {
  const response = await api.delete<LikeResponse>(`/posts/${id}/like`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
