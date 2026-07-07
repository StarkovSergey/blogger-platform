import { Response } from 'express'
import { RequestWithBody } from '../../../../common/types/utils-types.js'
import { BlogInputModel } from '../../models/BlogInputModel.js'
import { BlogViewModel } from '../../models/BlogViewModel.js'
import { blogsRepository } from '../../repositories/blogs.repository.js'
import { HttpStatus } from '../../../../common/constants/constants.js'

export function createBlogHandler(
  req: RequestWithBody<BlogInputModel>,
  res: Response<BlogViewModel>
) {
  const createdBlog = blogsRepository.create(req.body)
  res.status(HttpStatus.CREATED_201).json(createdBlog)
}
