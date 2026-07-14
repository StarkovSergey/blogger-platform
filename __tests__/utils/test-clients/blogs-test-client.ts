import { Express } from 'express'
import type { BlogInputModel } from '../../../src/features/blogs/models/BlogInputModel.js'
import request from 'supertest'
import { PATHS } from '../../../src/core/paths/paths.js'
import { generateAdminAuthToken } from '../generate-admin-auth-token.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import type { BlogViewModel } from '../../../src/features/blogs/models/BlogViewModel.js'
import { BlogPostInputModel } from '../../../src/features/blogs/models/BlogPostInputModel.js'
import { VALID_POST_INPUT } from './posts-test-client.js'
import { PostViewModel } from '../../../src/features/posts/models/PostViewModel.js'
import { BLOGS_PATHS } from '../../../src/features/blogs/router/blogs.router.js'

export const VALID_BLOG_INPUT: BlogInputModel = {
  name: 'Inis blog',
  websiteUrl: 'https://inis.com',
  description: 'Отчёты по партиям в Иниш',
}

export const createValidBlogPostInput = (
  overrides: Partial<BlogPostInputModel> = {}
): BlogPostInputModel => ({
  ...VALID_BLOG_POST_INPUT,
  ...overrides,
})

export const VALID_BLOG_POST_INPUT: BlogPostInputModel = VALID_POST_INPUT

export const blogsTestClient = {
  async createBlog(
    app: Express,
    blog: BlogInputModel = VALID_BLOG_INPUT
  ): Promise<BlogViewModel> {
    const res = await request(app)
      .post(PATHS.blogs)
      .set('Authorization', generateAdminAuthToken())
      .send(blog)
      .expect(HttpStatus.CREATED_201)

    return res.body
  },
  async getBlogById(app: Express, id: string): Promise<BlogViewModel> {
    const res = await request(app)
      .get(`${PATHS.blogs}/${id}`)
      .expect(HttpStatus.OK_200)

    return res.body
  },
  async updateBlog(
    app: Express,
    id: string,
    blogDto: BlogInputModel
  ): Promise<void> {
    const updatedBlogResponse = await request(app)
      .put(`${PATHS.blogs}/${id}`)
      .set('Authorization', generateAdminAuthToken())
      .send(blogDto)
      .expect(HttpStatus.NO_CONTENT_204)

    return updatedBlogResponse.body
  },
  async getBlogPosts(app: Express, blogId: string): Promise<PostViewModel[]> {
    const res = await request(app)
      .get(`${PATHS.blogs}/${blogId}/posts`)
      .expect(HttpStatus.OK_200)
    return res.body
  },
  async createBlogPost(
    app: Express,
    blogId: string,
    post: BlogPostInputModel = VALID_BLOG_POST_INPUT
  ): Promise<PostViewModel> {
    const res = await request(app)
      .post(`${PATHS.blogs}/${blogId}/posts`)
      .set('Authorization', generateAdminAuthToken())
      .send(post)
      .expect(HttpStatus.CREATED_201)

    return res.body
  },
}
