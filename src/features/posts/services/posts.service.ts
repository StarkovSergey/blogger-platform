import { WithId } from 'mongodb'
import { PostInputModel } from '../types/input/PostInputModel.js'
import { PostsRepository } from '../repositories/posts.repository.js'
import { BlogsRepository } from '../../blogs/repositories/blogs.repository.js'
import { inject, injectable } from 'inversify'
import { PostDB } from '../domain/post.schema.js'

@injectable()
export class PostsService {
  private postsRepository: PostsRepository
  private blogsRepository: BlogsRepository

  constructor(
    @inject(PostsRepository) postsRepository: PostsRepository,
    @inject(BlogsRepository) blogsRepository: BlogsRepository
  ) {
    this.postsRepository = postsRepository
    this.blogsRepository = blogsRepository
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
