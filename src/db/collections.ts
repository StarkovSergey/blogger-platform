import { Collection, Db } from 'mongodb'

import { BlogDB } from '../features/blogs/types/blogDB.js'
import { PostDB } from '../features/posts/types/postDB.js'
import { UserDB } from '../features/users/types/userDB.js'

export const BLOG_COLLECTION_NAME = 'blogs'
export const POST_COLLECTION_NAME = 'posts'
export const USER_COLLECTION_NAME = 'users'

export let blogsCollection: Collection<BlogDB>
export let postsCollection: Collection<PostDB>
export let usersCollection: Collection<UserDB>

export function initCollections(db: Db) {
  blogsCollection = db.collection<BlogDB>(BLOG_COLLECTION_NAME)
  postsCollection = db.collection<PostDB>(POST_COLLECTION_NAME)
  usersCollection = db.collection<UserDB>(USER_COLLECTION_NAME)
}

export function getAllCollections(): Collection<any>[] {
  return [blogsCollection, postsCollection, usersCollection]
}
