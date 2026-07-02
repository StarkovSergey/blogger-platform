import { Router } from 'express'
import { getBlogListHandler } from './handlers/get-blog-list.handler.js'
import { createBlogHandler } from './handlers/create-blog.handler.js'
import { getBlogHandler } from './handlers/get-blog.handler.js'
import { deleteBlogHandler } from './handlers/delete-blog.handler.js'
import { updateBlogHandler } from './handlers/update-blog.handler.js'
import { superAdminGuardMiddleware } from '../../core/auth/middleware/super-admin.guard-middleware.js'
import { createBlogInputModelValidationChain } from './validation/blog.input-model.validation.js'
import { inputValidationResultMiddleware } from '../../core/middleware/input-validation-result.middleware.js'

export const blogsRouter = Router()

blogsRouter.get('', getBlogListHandler)
blogsRouter.get('/:id', getBlogHandler)
blogsRouter.post(
  '',
  superAdminGuardMiddleware,
  createBlogInputModelValidationChain(),
  inputValidationResultMiddleware,
  createBlogHandler
)
blogsRouter.delete('/:id', superAdminGuardMiddleware, deleteBlogHandler)
blogsRouter.put(
  '/:id',
  superAdminGuardMiddleware,
  createBlogInputModelValidationChain(),
  updateBlogHandler
)
