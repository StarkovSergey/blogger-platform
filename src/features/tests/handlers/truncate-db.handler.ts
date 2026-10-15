import { Request, Response } from 'express'
import { HttpStatus } from '../../../common/constants/constants.js'
import { BlogModel } from '../../blogs/domain/blog.schema.js'
import { PostModel } from '../../posts/domain/post.schema.js'
import { UserModel } from '../../users/domain/user.schema.js'
import { SessionModel } from '../../auth/domain/session.schema.js'
import { CommentModel } from '../../comments/domain/comment.schema.js'
import { CommentLikeModel } from '../../comments/domain/comment-like.schema.js'
import { rateLimitModel } from '../../../core/domain/rate-limit.schema.js'

export async function truncateDbHandler(req: Request, res: Response) {
  try {
    await Promise.all([
      BlogModel.deleteMany({}),
      PostModel.deleteMany({}),
      UserModel.deleteMany({}),
      SessionModel.deleteMany({}),
      CommentModel.deleteMany({}),
      CommentLikeModel.deleteMany({}),
      rateLimitModel.deleteMany({}),
    ])

    res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
