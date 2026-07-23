import { Response } from 'express'
import { RequestWithBody } from '../../../../core/types/utils-types.js'
import { BlogInputModel } from '../../types/input/BlogInputModel.js'
import { BlogViewModel } from '../../types/output/BlogViewModel.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { blogsService } from '../../services/blogs.service.js'
import { errorsHandlers } from '../../../../core/exceptions/errors-handlers.js'
import { blogsQueryRepository } from '../../repositories/blogs.query.repository.js'

export async function createBlogHandler(
  req: RequestWithBody<BlogInputModel>,
  res: Response<BlogViewModel>
) {
  try {
    const createdBlogId = await blogsService.create(req.body)
    const createdBlog = await blogsQueryRepository.findByIdOrFail(createdBlogId)
    res.status(HttpStatus.CREATED_201).json(createdBlog)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
