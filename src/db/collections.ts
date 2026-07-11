import { Collection, Db } from 'mongodb'
import { PostViewModel } from '../features/posts/models/PostViewModel.js'

import { Blog } from '../features/blogs/types/blog.js'
import { Post } from '../features/posts/types/post.js'

export const BLOG_COLLECTION_NAME = 'blogs'
export const POST_COLLECTION_NAME = 'posts'

export let blogsCollection: Collection<Blog>
export let postsCollection: Collection<Post>

export function initCollections(db: Db) {
  blogsCollection = db.collection<Blog>(BLOG_COLLECTION_NAME)
  postsCollection = db.collection<Post>(POST_COLLECTION_NAME)
}

export function getAllCollections(): Collection<any>[] {
  return [blogsCollection, postsCollection]
}
