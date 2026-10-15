import { WithId } from 'mongodb'
import { PostInputModel } from '../types/input/PostInputModel.js'
import { PostsRepository } from '../repositories/posts.repository.js'
import { BlogsRepository } from '../../blogs/repositories/blogs.repository.js'
import { inject, injectable } from 'inversify'
import { PostDB, PostModel } from '../domain/post.schema.js'

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

    const post = PostModel.createPost({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
    })
    const saved = await this.postsRepository.save(post)
    return saved._id.toString()
  }

  async deletePost(id: string) {
    await this.postsRepository.delete(id)
  }

  async update(id: string, dto: PostInputModel): Promise<void> {
    await this.blogsRepository.findByIdOrFail(dto.blogId) // если блога нет -> ошибка

    const post = await this.postsRepository.findByIdOrFail(id)
    post.update(dto)
    await this.postsRepository.save(post)
  }
}
