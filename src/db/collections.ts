import { Collection, Db } from 'mongodb'

import { BlogDB } from '../features/blogs/types/blogDB.js'
import { PostDB } from '../features/posts/types/postDB.js'
import { UserDB } from '../features/users/types/userDB.js'
import { CommentDB } from '../features/comments/types/commentDB.js'
import { RefreshBlackListItemDB } from '../features/auth/types/RefreshBlackListItem.js'

export const BLOG_COLLECTION_NAME = 'blogs'
export const POST_COLLECTION_NAME = 'posts'
export const USER_COLLECTION_NAME = 'users'
export const COMMENTS_COLLECTION_NAME = 'comments'
export const REFRESH_BLACK_LIST_NAME = 'refresh_black_list'

export let blogsCollection: Collection<BlogDB>
export let postsCollection: Collection<PostDB>
export let usersCollection: Collection<UserDB>
export let commentsCollection: Collection<CommentDB>
export let refreshBlackListCollection: Collection<RefreshBlackListItemDB>

export async function initCollections(db: Db) {
  blogsCollection = db.collection<BlogDB>(BLOG_COLLECTION_NAME)
  postsCollection = db.collection<PostDB>(POST_COLLECTION_NAME)
  usersCollection = db.collection<UserDB>(USER_COLLECTION_NAME)
  commentsCollection = db.collection<CommentDB>(COMMENTS_COLLECTION_NAME)
  refreshBlackListCollection = db.collection<RefreshBlackListItemDB>(
    REFRESH_BLACK_LIST_NAME
  )

  await refreshBlackListCollection.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
  )
}

export function getAllCollections(): Collection<any>[] {
  return [
    blogsCollection,
    postsCollection,
    usersCollection,
    commentsCollection,
    refreshBlackListCollection,
  ]
}
