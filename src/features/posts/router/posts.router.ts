import { RequestHandler, Router } from 'express'

import { superAdminGuardMiddleware } from '../../../core/auth/middleware/super-admin.guard-middleware.js'
import { inputValidationResultMiddleware } from '../../../core/middleware/validation/input-validation-result.middleware.js'
import { paramsIdValidationMiddleware } from '../../../core/middleware/validation/params-id-validation.middleware.js'
import { createPostHandler } from './handlers/create-post.handler.js'
import { getPostListHandler } from './handlers/get-post-list.handler.js'
import { getPostHandler } from './handlers/get-post.handler.js'
import { updatePostHandler } from './handlers/update-post.handler.js'
import { deletePostHandler } from './handlers/delete-post.handler.js'
import { createPostInputModelValidationChain } from '../validation/post.input-model.validation.js'
import { paginationAndSortingValidation } from '../../../core/middleware/validation/query-pagination-sorting.validation.middleware.js'
import { PostSortField } from '../types/input/post-sort-field.js'
import { sanitizeQueryMiddleware } from '../../../core/middleware/validation/sanitize-query.middleware.js'

export const POSTS_PATHS = {
  ROOT: '',
  BY_ID: '/:id',
}

export const postsRouter = Router()

postsRouter.get(
  POSTS_PATHS.ROOT,
  paginationAndSortingValidation(PostSortField),
  inputValidationResultMiddleware,
  sanitizeQueryMiddleware,
  getPostListHandler as unknown as RequestHandler
)

postsRouter.get(
  POSTS_PATHS.BY_ID,
  paramsIdValidationMiddleware,
  inputValidationResultMiddleware,
  getPostHandler
)

postsRouter.post(
  POSTS_PATHS.ROOT,
  superAdminGuardMiddleware,
  createPostInputModelValidationChain(),
  inputValidationResultMiddleware,
  createPostHandler
)

postsRouter.put(
  POSTS_PATHS.BY_ID,
  paramsIdValidationMiddleware,
  superAdminGuardMiddleware,
  createPostInputModelValidationChain(),
  inputValidationResultMiddleware,
  updatePostHandler
)
postsRouter.delete(
  POSTS_PATHS.BY_ID,
  paramsIdValidationMiddleware,
  superAdminGuardMiddleware,
  inputValidationResultMiddleware,
  deletePostHandler
)
