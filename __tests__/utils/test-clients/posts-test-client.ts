import { Express } from 'express'
import { PostInputModel } from '../../../src/features/posts/types/input/PostInputModel.js'
import request from 'supertest'
import { PATHS } from '../../../src/core/paths/paths.js'
import { generateAdminAuthToken } from '../generate-admin-auth-token.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { PostViewModel } from '../../../src/features/posts/types/output/PostViewModel.js'

export const VALID_POST_INPUT: Omit<PostInputModel, 'blogId'> = {
  title: 'Some title',
  content: 'Content',
  shortDescription: 'some description',
}

export const createValidPostInput = (
  blogId: string,
  overrides: Partial<Omit<PostInputModel, 'blogId'>> = {}
): PostInputModel => ({
  ...VALID_POST_INPUT,
  ...overrides,
  blogId,
})

export const postsTestClient = {
  async createPost(app: Express, post: PostInputModel) {
    const res = await request(app)
      .post(PATHS.posts)
      .set('Authorization', generateAdminAuthToken())
      .send(post)
      .expect(HttpStatus.CREATED_201)

    return res.body
  },
  async getPostById(app: Express, id: string): Promise<PostViewModel> {
    const res = await request(app)
      .get(`${PATHS.posts}/${id}`)
      .expect(HttpStatus.OK_200)

    return res.body
  },
  async updatePost(
    app: Express,
    id: string,
    postDto: PostInputModel
  ): Promise<PostViewModel> {
    const updatedPost = await request(app)
      .put(`${PATHS.posts}/${id}`)
      .set('Authorization', generateAdminAuthToken())
      .send(postDto)
      .expect(HttpStatus.NO_CONTENT_204)

    return updatedPost.body
  },
  async deletePost(app: Express, id: string): Promise<void> {
    await request(app)
      .delete(`${PATHS.posts}/${id}`)
      .set('Authorization', generateAdminAuthToken())
      .expect(HttpStatus.NO_CONTENT_204)
  },
}
