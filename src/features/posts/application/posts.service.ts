import { postsRepository } from '../repositories/posts.repository.js'
import { WithId } from 'mongodb'
import { Post } from '../types/post.js'

export const postsService = {
  async findMany(): Promise<WithId<Post>[]> {
    return postsRepository.findMany()
  },
  async findByIdOrFailed(id: string): Promise<WithId<Post>> {
    return postsRepository.findByIdOrFailed(id)
  },
}
