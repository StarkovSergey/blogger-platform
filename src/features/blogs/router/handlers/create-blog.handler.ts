import { Response } from 'express'
import { RequestWithBody } from '../../../../common/types/utils-types.js'
import { BlogInputModel } from '../../models/BlogInputModel.js'
import { BlogViewModel } from '../../models/BlogViewModel.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { mapToBlogListViewModel } from '../mappers/map-to-blog-list-view-model.js'
import { blogsService } from '../../application/blogs.service.js'

export async function createBlogHandler(
  req: RequestWithBody<BlogInputModel>,
  res: Response<BlogViewModel>
) {
  try {
    const createdBlog = await blogsService.create(req.body)
    const blogViewModel = mapToBlogListViewModel(createdBlog)
    res.status(HttpStatus.CREATED_201).json(blogViewModel)
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
