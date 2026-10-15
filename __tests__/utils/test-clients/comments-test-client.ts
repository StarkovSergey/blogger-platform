import { Express } from 'express'
import request from 'supertest'
import { PATHS } from '../../../src/core/paths/paths.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { CommentViewModel } from '../../../src/features/comments/types/output/CommentViewModel.js'
import { ReactionStatus } from '../../../src/features/comments/constants/enums.js'
import { Pagination } from '../../../src/core/types/paginated-output.js'

export const VALID_COMMENT_CONTENT =
  'This is a valid comment content for tests'

export const commentsTestClient = {
  async createComment(
    app: Express,
    postId: string,
    accessToken: string,
    content: string = VALID_COMMENT_CONTENT
  ): Promise<CommentViewModel> {
    const res = await request(app)
      .post(`${PATHS.posts}/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content })
      .expect(HttpStatus.CREATED_201)

    return res.body
  },

  async updateLikeStatus(
    app: Express,
    commentId: string,
    accessToken: string | null,
    likeStatus: ReactionStatus | string,
    expectedStatus: number = HttpStatus.NO_CONTENT_204
  ) {
    const req = request(app).put(
      `${PATHS.comments}/${commentId}/like-status`
    )

    if (accessToken) {
      req.set('Authorization', `Bearer ${accessToken}`)
    }

    return req.send({ likeStatus }).expect(expectedStatus)
  },

  async getComment(
    app: Express,
    commentId: string,
    accessToken?: string
  ): Promise<CommentViewModel> {
    const req = request(app).get(`${PATHS.comments}/${commentId}`)

    if (accessToken) {
      req.set('Authorization', `Bearer ${accessToken}`)
    }

    const res = await req.expect(HttpStatus.OK_200)
    return res.body
  },

  async getPostComments(
    app: Express,
    postId: string,
    accessToken?: string
  ): Promise<Pagination<CommentViewModel>> {
    const req = request(app).get(`${PATHS.posts}/${postId}/comments`)

    if (accessToken) {
      req.set('Authorization', `Bearer ${accessToken}`)
    }

    const res = await req.expect(HttpStatus.OK_200)
    return res.body
  },
}
