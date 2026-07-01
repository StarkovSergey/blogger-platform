import { Router } from 'express'
import { getBlogListHandler } from './handlers/get-blog-list.handler.js'
import { createBlogHandler } from './handlers/create-blog.handler.js'
import { getBlogHandler } from './handlers/get-blog.handler.js'
import { deleteBlogHandler } from './handlers/delete-blog.handler.js'
import { updateBlogHandler } from './handlers/update-blog.handler.js'

export const blogsRouter = Router()

blogsRouter.get('', getBlogListHandler)
blogsRouter.get('/:id', getBlogHandler)
blogsRouter.post('', createBlogHandler)
blogsRouter.delete('/:id', deleteBlogHandler)
blogsRouter.put('/:id', updateBlogHandler)
