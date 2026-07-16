import { WithId } from 'mongodb'
import { Blog, BlogErrorCode } from '../types/blog.js'
import { blogsRepository } from '../repositories/blogs.repository.js'
import { BlogInputModel } from '../models/BlogInputModel.js'
import { DomainException } from '../../../core/exeptions/domain.exception.js'
import { Post } from '../../posts/types/post.js'
import { postsRepository } from '../../posts/repositories/posts.repository.js'
import { BlogPostInputModel } from '../models/BlogPostInputModel.js'
import { BlogQueryInput } from '../types/input/blog-query-input.js'
import { PostQueryInput } from '../../posts/types/input/post-query-input.js'

export const blogsService = {
  async findMany(queryDto: BlogQueryInput): Promise<{
    items: WithId<Blog>[]
    totalCount: number
  }> {
    return blogsRepository.findMany(queryDto)
  },
  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    return blogsRepository.findByIdOrFail(id)
  },
  async findPostsByBlog(
    blogId: string,
    queryDto: PostQueryInput
  ): Promise<{
    items: WithId<Post>[]
    totalCount: number
  }> {
    await blogsRepository.findByIdOrFail(blogId) // если блога нет -> ошибка

    return postsRepository.findPostsByBlog(blogId, queryDto)
  },
  async create(blog: BlogInputModel): Promise<WithId<Blog>> {
    const newBlog: Blog = {
      ...blog,
      isMembership: false,
      createdAt: new Date(),
    }

    return blogsRepository.create(newBlog)
  },
  async createBlogPost(blogId: string, dto: BlogPostInputModel) {
    const blog = await blogsRepository.findByIdOrFail(blogId)

    const newPost: Post = {
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
