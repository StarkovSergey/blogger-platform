import { Router } from 'express'

import { superAdminGuardMiddleware } from '../../../core/auth/middleware/super-admin.guard-middleware.js'
import { inputValidationResultMiddleware } from '../../../core/middleware/validation/input-validation-result.middleware.js'
import { paramsIdValidationMiddleware } from '../../../core/middleware/validation/params-id-validation.middleware.js'
import { createPostHandler } from './handlers/create-post.handler.js'
import { getPostListHandler } from './handlers/get-post-list.handler.js'
import { getPostHandler } from './handlers/get-post.handler.js'
import { updatePostHandler } from './handlers/update-post.handler.js'
import { deletePostHandler } from './handlers/delete-post.handler.js'
import { createPostInputModelValidationChain } from '../validation/post.input-model.validation.js'

export const postsRouter = Router()

postsRouter.get('', getPostListHandler)
postsRouter.get(
  '/:id',
  paramsIdValidationMiddleware,
  superAdminGuardMiddleware,
  inputValidationResultMiddleware,
  getPostHandler
)

postsRouter.post(
  '',
  superAdminGuardMiddleware,
  createPostInputModelValidationChain(),
  inputValidationResultMiddleware,
  createPostHandler
)

postsRouter.put(
  '/:id',
  paramsIdValidationMiddleware,
  superAdminGuardMiddleware,
  createPostInputModelValidationChain(),
  inputValidationResultMiddleware,
  updatePostHandler
)
postsRouter.delete(
  '/:id',
  paramsIdValidationMiddleware,
  superAdminGuardMiddleware,
  inputValidationResultMiddleware,
  deletePostHandler
)
