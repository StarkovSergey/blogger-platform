import { body } from 'express-validator'
import { ReactionStatus } from '../constants/enums.js'

export const createCommentLikeInputValidationChain = () =>
  body('likeStatus')
    .isString()
    .isIn(Object.values(ReactionStatus))
    .withMessage('likeStatus should be None, Like or Dislike')
