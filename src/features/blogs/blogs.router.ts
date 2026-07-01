import { Router } from 'express'
import { getBlogListHandler } from './handlers/get-blog-list.handler.js'

export const blogsRouter = Router()

blogsRouter.get('', getBlogListHandler)
