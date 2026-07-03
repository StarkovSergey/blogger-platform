import { Express } from 'express'
import type { BlogInputModel } from '../../../src/features/blogs/models/BlogInputModel.js'
import request from 'supertest'
import { PATHS } from '../../../src/core/paths/paths.js'
import { generateAdminAuthToken } from '../generate-admin-auth-token.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import type { BlogViewModel } from '../../../src/features/blogs/models/BlogViewModel.js'

export const VALID_BLOG_INPUT: BlogInputModel = {
  name: 'Inis blog',
  websiteUrl: 'https://inis.com',
  description: 'Отчёты по партиям в Иниш',
}

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
}
