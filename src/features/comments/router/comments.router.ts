import { Router } from 'express'
import { paramsIdValidationMiddleware } from '../../../core/middleware/validation/params-id-validation.middleware.js'
import { getCommentHandler } from './handlers/get-comment-handler.js'
import { inputValidationResultMiddleware } from '../../../core/middleware/validation/input-validation-result.middleware.js'
import { accessTokenGuard } from '../../../core/middleware/validation/access-token-guard.middleware.js'
import { updateCommentHandler } from './handlers/update-comment-handler.js'
import { deleteCommentHandler } from './handlers/delete-comment-handler.js'
import { createCommentInputModelValidationChain } from '../validation/comment.input-model.validation.js'

export const COMMENTS_PATHS = {
  ROOT: '',
  BY_ID: '/:id',
}

export const commentsRouter = Router()

commentsRouter.put(
  COMMENTS_PATHS.BY_ID,
  paramsIdValidationMiddleware,
  accessTokenGuard,
  createCommentInputModelValidationChain(),
  inputValidationResultMiddleware,
  updateCommentHandler
)

commentsRouter.get(
  COMMENTS_PATHS.BY_ID,
  paramsIdValidationMiddleware,
  inputValidationResultMiddleware,
  getCommentHandler
)

commentsRouter.delete(
  COMMENTS_PATHS.BY_ID,
  paramsIdValidationMiddleware,
  accessTokenGuard,
  inputValidationResultMiddleware,
  deleteCommentHandler
)
