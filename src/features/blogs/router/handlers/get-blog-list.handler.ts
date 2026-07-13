import { Request, Response } from 'express'
import { BlogViewModel } from '../../models/BlogViewModel.js'
import { mapToBlogListViewModel } from '../mappers/map-to-blog-list-view-model.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { blogsService } from '../../application/blogs.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers'

export const getBlogListHandler = async (
  req: Request,
  res: Response<BlogViewModel[]>
) => {
  try {
    const blogs = await blogsService.findMany()
    const blogsViewModels = blogs.map(mapToBlogListViewModel)
    res.json(blogsViewModels)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
