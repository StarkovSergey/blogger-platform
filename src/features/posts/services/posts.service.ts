import { WithId } from 'mongodb'
import { PostDB } from '../types/postDB.js'
import { PostInputModel } from '../types/input/PostInputModel.js'
import { PostQueryInput } from '../types/input/post-query-input.js'
import { PostsRepository } from '../repositories/posts.repository.js'
import { BlogsRepository } from '../../blogs/repositories/blogs.repository.js'

export class PostsService {
  postsRepository: PostsRepository
  blogsRepository: BlogsRepository

  constructor(
    postsRepository: PostsRepository,
    blogsRepository: BlogsRepository
  ) {
    this.postsRepository = postsRepository
    this.blogsRepository = blogsRepository
  }

  async findMany(queryDto: PostQueryInput): Promise<{
    items: WithId<PostDB>[]
    totalCount: number
  }> {
    return this.postsRepository.findMany(queryDto)
  }

  async findByIdOrFailed(id: string): Promise<WithId<PostDB>> {
    return this.postsRepository.findByIdOrFail(id)
  }

  async createPost(dto: PostInputModel) {
    const blog = await this.blogsRepository.findByIdOrFail(dto.blogId)

    const post: PostDB = {
      ...dto,
      createdAt: new Date(),
      blogName: blog.name,
    }

    return this.postsRepository.create(post)
  }

  async deletePost(id: string) {
    await this.postsRepository.delete(id)
  }

  async update(id: string, dto: PostInputModel): Promise<void> {
    await this.blogsRepository.findByIdOrFail(dto.blogId) // если блога нет -> ошибка
    await this.postsRepository.update(id, dto)
  }
}
