import { Router, RequestHandler } from 'express'
import { getUserListHandler } from './handlers/get-user-list.handler.js'
import { paginationAndSortingValidation } from '../../../core/middleware/validation/query-pagination-sorting.validation.middleware.js'
import { UserSortField } from '../types/input/user-sort-field.js'
import { inputValidationResultMiddleware } from '../../../core/middleware/validation/input-validation-result.middleware.js'
import { sanitizeQueryMiddleware } from '../../../core/middleware/validation/sanitize-query.middleware.js'
import { superAdminGuardMiddleware } from '../../../core/auth/middleware/super-admin.guard-middleware.js'
import { createUserHandler } from './handlers/create-user.handler.js'
import { createUserInputModelValidationChain } from '../validation/user.input-model.validation.js'
import { deleteUserHandler } from './handlers/delete-user.handler.js'
import { paramsIdValidationMiddleware } from '../../../core/middleware/validation/params-id-validation.middleware.js'
import { createUserFilterQueryValidation } from '../validation/user-filter-query.validation.js'

export const usersRouter = Router()

export const USERS_PATHS = {
  ROOT: '',
  BY_ID: '/:id',
} as const

usersRouter.get(
  USERS_PATHS.ROOT,
  superAdminGuardMiddleware,
  paginationAndSortingValidation(UserSortField),
  createUserFilterQueryValidation(),
  inputValidationResultMiddleware,
  sanitizeQueryMiddleware,
  getUserListHandler as unknown as RequestHandler
)

usersRouter.post(
  USERS_PATHS.ROOT,
  superAdminGuardMiddleware,
  createUserInputModelValidationChain(),
  inputValidationResultMiddleware,
  createUserHandler
)

usersRouter.delete(
  USERS_PATHS.BY_ID,
  paramsIdValidationMiddleware,
  superAdminGuardMiddleware,
  inputValidationResultMiddleware,
  deleteUserHandler
)
