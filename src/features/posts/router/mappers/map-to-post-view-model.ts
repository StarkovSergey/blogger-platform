import { WithId } from 'mongodb'
import { PostDB } from '../../types/postDB.js'
import { PostViewModel } from '../../types/output/PostViewModel.js'

export const mapToPostViewModel = (post: WithId<PostDB>): PostViewModel => {
  return {
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    shortDescription: post.shortDescription,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
  }
}
