export type SocialUser = { id: number; name: string; username: string }
export type SocialSession = { token: string; user: SocialUser }
export type LoginPayload = { email: string; password: string }
export type SocialPost = {
  id: number
  caption: string | null
  author: SocialUser
  likeCount: number
  likedByMe: boolean
}
export type PostsPage = {
  posts: SocialPost[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}
export type PostsResponse = { success: boolean; message: string; data: PostsPage }
export type LoginResponse = { success: boolean; message: string; data: SocialSession }
export type LikeResponse = { success: boolean; message: string }
