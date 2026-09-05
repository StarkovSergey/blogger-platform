import { WithId } from 'mongodb'
import { BlogDB, BlogErrorCode } from '../types/blogDB.js'
import { BlogsRepository } from '../repositories/blogs.repository.js'
import { BlogInputModel } from '../types/input/BlogInputModel.js'
import { DomainException } from '../../../core/exceptions/domain.exception.js'
import { PostDB } from '../../posts/types/postDB.js'
import { BlogPostInputModel } from '../types/input/BlogPostInputModel.js'
import { PostsRepository } from '../../posts/repositories/posts.repository.js'

export class BlogsService {
  blogsRepository: BlogsRepository
  postsRepository: PostsRepository

  constructor(
    blogsRepository: BlogsRepository,
    postsRepository: PostsRepository
  ) {
    this.blogsRepository = blogsRepository
    this.postsRepository = postsRepository
  }

  async findByIdOrFail(id: string): Promise<WithId<BlogDB>> {
    return this.blogsRepository.findByIdOrFail(id)
  }

  async create(blog: BlogInputModel): Promise<string> {
    const newBlog: BlogDB = {
      ...blog,
      isMembership: false,
      createdAt: new Date(),
    }

    return await this.blogsRepository.create(newBlog)
  }

  async createBlogPost(
    blogId: string,
    dto: BlogPostInputModel
  ): Promise<string> {
    const blog = await this.blogsRepository.findByIdOrFail(blogId)

    const newPost: PostDB = {
      ...dto,
      blogId,
      createdAt: new Date(),
      blogName: blog.name,
    }
    return await this.postsRepository.create(newPost)
  }

  async update(id: string, dto: BlogInputModel): Promise<void> {
    await this.blogsRepository.update(id, dto)
    return
  }

  async delete(id: string) {
    const postsCount = await this.postsRepository.countByBlogId(id)

    if (postsCount > 0) {
      throw new DomainException(
        'Blog has posts. Remove all posts for delete blog',
        BlogErrorCode.HasPosts
      )
    }

    await this.blogsRepository.delete(id)
    return
  }
}
