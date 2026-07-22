import { Response } from 'express'
import { BlogViewModel } from '../../models/BlogViewModel.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'
import { RequestWithQuery } from '../../../../core/types/utils-types.js'
import { BlogQueryInput } from '../../types/input/blog-query-input.js'
import { PaginatedOutput } from '../../../../core/types/paginated-output.js'
import { blogsQueryRepository } from '../../repositories/blogs.query.repository.js'

export const getBlogListHandler = async (
  req: RequestWithQuery<BlogQueryInput>,
  res: Response<
    {
      items: BlogViewModel[]
    } & PaginatedOutput
  >
) => {
  try {
    const queryInput = req.query
    const paginatedOutput = await blogsQueryRepository.findMany(queryInput)

    res.json(paginatedOutput)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
