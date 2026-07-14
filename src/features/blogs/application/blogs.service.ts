import { WithId } from 'mongodb'
import { Blog, BlogErrorCode } from '../types/blog.js'
import { blogsRepository } from '../repositories/blogs.repository.js'
import { BlogInputModel } from '../models/BlogInputModel.js'
import { DomainException } from '../../../core/exeptions/domain.exception.js'

export const blogsService = {
  async findMany(): Promise<WithId<Blog>[]> {
    return blogsRepository.findMany()
  },
  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    return blogsRepository.findByIdOrFail(id)
  },
  async create(blog: BlogInputModel): Promise<WithId<Blog>> {
    const newBlog: Blog = {
      ...blog,
      isMembership: false,
      createdAt: new Date(),
    }

    return blogsRepository.create(newBlog)
  },
  async update(id: string, dto: BlogInputModel): Promise<void> {
    await blogsRepository.update(id, dto)
    return
  },
  async delete(id: string) {
    // TODO: при удалении блога с постами - скорее всего написать, что нельзя удалять блог - DomainError
    const isBlogHasPosts = false // тут будет запрос за постами блога и проверка

    if (isBlogHasPosts) {
      throw new DomainException(
        'Blog has posts. Remove all posts for delete blog',
        BlogErrorCode.HasPosts
      )
    }

    await blogsRepository.delete(id)
    return
  },
}
