import { postsRepository } from '../repositories/posts.repository.js'
import { WithId } from 'mongodb'
import { Post } from '../types/post.js'
import { PostInputModel } from '../models/PostInputModel.js'
import { blogsRepository } from '../../blogs/repositories/blogs.repository.js'

export const postsService = {
  async findMany(): Promise<WithId<Post>[]> {
    return postsRepository.findMany()
  },
  async findByIdOrFailed(id: string): Promise<WithId<Post>> {
    return postsRepository.findByIdOrFailed(id)
  },
  async createPost(dto: PostInputModel) {
    const blog = await blogsRepository.findByIdOrFail(dto.blogId)

    const post: Post = {
      ...dto,
      createdAt: new Date(),
      blogName: blog.name,
    }

    return postsRepository.create(post)
  },
}
