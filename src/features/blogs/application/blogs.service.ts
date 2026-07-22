import { WithId } from 'mongodb'
import { BlogDB, BlogErrorCode } from '../types/blogDB.js'
import { blogsRepository } from '../repositories/blogs.repository.js'
import { BlogInputModel } from '../types/input/BlogInputModel.js'
import { DomainException } from '../../../core/exeptions/domain.exception.js'
import { PostDB } from '../../posts/types/postDB.js'
import { postsRepository } from '../../posts/repositories/posts.repository.js'
import { BlogPostInputModel } from '../types/input/BlogPostInputModel.js'

export const blogsService = {
  async findByIdOrFail(id: string): Promise<WithId<BlogDB>> {
    return blogsRepository.findByIdOrFail(id)
  },
  async create(blog: BlogInputModel): Promise<string> {
    const newBlog: BlogDB = {
      ...blog,
      isMembership: false,
      createdAt: new Date(),
    }

    return await blogsRepository.create(newBlog)
  },
  async createBlogPost(
    blogId: string,
    dto: BlogPostInputModel
  ): Promise<string> {
    const blog = await blogsRepository.findByIdOrFail(blogId)

    const newPost: PostDB = {
      ...dto,
      blogId,
      createdAt: new Date(),
      blogName: blog.name,
    }
    return await postsRepository.create(newPost)
  },
  async update(id: string, dto: BlogInputModel): Promise<void> {
    await blogsRepository.update(id, dto)
    return
  },
  async delete(id: string) {
    const postsCount = await postsRepository.countByBlogId(id)

    if (postsCount > 0) {
      throw new DomainException(
        'Blog has posts. Remove all posts for delete blog',
        BlogErrorCode.HasPosts
      )
    }

    await blogsRepository.delete(id)
    return
  },
}
