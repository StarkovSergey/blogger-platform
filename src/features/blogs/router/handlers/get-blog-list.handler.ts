import { Request, Response } from 'express'
import { blogsRepository } from '../../repositories/blogs.repository.js'
import { BlogViewModel } from '../../models/BlogViewModel.js'

export const getBlogListHandler = (
  req: Request,
  res: Response<BlogViewModel[]>
) => {
  const blogs = blogsRepository.findAll()
  res.json(blogs)
}
