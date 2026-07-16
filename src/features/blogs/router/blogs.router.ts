import { RequestHandler, Router } from 'express'
import { getBlogListHandler } from './handlers/get-blog-list.handler.js'
import { createBlogHandler } from './handlers/create-blog.handler.js'
import { getBlogHandler } from './handlers/get-blog.handler.js'
import { deleteBlogHandler } from './handlers/delete-blog.handler.js'
import { updateBlogHandler } from './handlers/update-blog.handler.js'
import { superAdminGuardMiddleware } from '../../../core/auth/middleware/super-admin.guard-middleware.js'
import { createBlogInputModelValidationChain } from '../validation/blog.input-model.validation.js'
import { inputValidationResultMiddleware } from '../../../core/middleware/validation/input-validation-result.middleware.js'
import { paramsIdValidationMiddleware } from '../../../core/middleware/validation/params-id-validation.middleware.js'
import { getBlogPostsHandler } from './handlers/get-blog-posts.handler.js'
import { createBlogPostInputModelValidationChain } from '../validation/blog-post.input-model.validation.js'
import { createBlogPostHandler } from './handlers/create-blog-post.handler.js'
import { paginationAndSortingValidation } from '../../../core/middleware/validation/query-pagination-sorting.validation.middleware.js'
import { BlogSortField } from '../types/input/blog-sort-field.js'
import { sanitizeQueryMiddleware } from '../../../core/middleware/validation/sanitize-query.middleware.js'
import { createBlogFilterQueryValidation } from '../validation/blog-filter-query.validation.js'

export const blogsRouter = Router()

export const BLOGS_PATHS = {
  ROOT: '',
  BY_ID: '/:id',
  BLOG_POSTS: '/:id/posts',
} as const

blogsRouter.get(
  BLOGS_PATHS.ROOT,
  paginationAndSortingValidation(BlogSortField),
  createBlogFilterQueryValidation(),
  inputValidationResultMiddleware,
  sanitizeQueryMiddleware,
  getBlogListHandler as unknown as RequestHandler
)
blogsRouter.get(
  BLOGS_PATHS.BY_ID,
  paramsIdValidationMiddleware,
  inputValidationResultMiddleware,
  getBlogHandler
)
blogsRouter.post(
  BLOGS_PATHS.ROOT,
  superAdminGuardMiddleware,
  createBlogInputModelValidationChain(),
  inputValidationResultMiddleware,
  createBlogHandler
)
blogsRouter.delete(
  BLOGS_PATHS.BY_ID,
  paramsIdValidationMiddleware,
  superAdminGuardMiddleware,
  inputValidationResultMiddleware,
  deleteBlogHandler
)
blogsRouter.put(
  BLOGS_PATHS.BY_ID,
  paramsIdValidationMiddleware,
  superAdminGuardMiddleware,
  createBlogInputModelValidationChain(),
  inputValidationResultMiddleware,
  updateBlogHandler
)
blogsRouter.get(
  BLOGS_PATHS.BLOG_POSTS,
  paramsIdValidationMiddleware,
  inputValidationResultMiddleware,
  getBlogPostsHandler
)
blogsRouter.post(
  BLOGS_PATHS.BLOG_POSTS,
  paramsIdValidationMiddleware,
  superAdminGuardMiddleware,
  createBlogPostInputModelValidationChain(),
  inputValidationResultMiddleware,
  createBlogPostHandler
)
