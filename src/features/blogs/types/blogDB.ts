export type BlogDB = {
  name: string
  description: string
  websiteUrl: string
  isMembership: boolean
  createdAt: Date
}

export enum BlogErrorCode {
  HasPosts = 'BLOG_HAS_POSTS',
}
