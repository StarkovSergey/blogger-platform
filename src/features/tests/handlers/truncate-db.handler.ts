import { Request, Response } from 'express'
import { HttpStatus } from '../../../common/constants/constants.js'
import { blogModel } from '../../blogs/domain/blog.schema.js'
import { postModel } from '../../posts/domain/post.schema.js'
import { userModel } from '../../users/domain/user.schema.js'
import { sessionModel } from '../../auth/domain/session.schema.js'
import { commentModel } from '../../comments/domain/comment.schema.js'
import { rateLimitModel } from '../../../core/domain/rate-limit.schema.js'

export async function truncateDbHandler(req: Request, res: Response) {
  try {
    await Promise.all([
      blogModel.deleteMany({}),
      postModel.deleteMany({}),
      userModel.deleteMany({}),
      sessionModel.deleteMany({}),
      commentModel.deleteMany({}),
      rateLimitModel.deleteMany({}),
    ])

    res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
