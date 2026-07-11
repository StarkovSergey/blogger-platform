import { WithId } from 'mongodb'
import { Post } from '../../types/post.js'
import { PostViewModel } from '../../models/PostViewModel.js'

export const mapToPostViewModel = (post: WithId<Post>): PostViewModel => {
  return {
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    shortDescription: post.shortDescription,
    blogId: post.blogId,
    blogName: post.blogName,
  }
}
