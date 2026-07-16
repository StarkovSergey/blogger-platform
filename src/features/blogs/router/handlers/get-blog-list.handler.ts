import { Response } from 'express'
import { BlogViewModel } from '../../models/BlogViewModel.js'
import { mapToBlogListViewModel } from '../mappers/map-to-blog-list-view-model.js'
import { blogsService } from '../../application/blogs.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'
import { RequestWithQuery } from '../../../../core/types/utils-types.js'
import { BlogQueryInput } from '../../types/input/blog-query-input.js'
import { mapToPaginatedOutput } from '../../../../core/mappers/map-to-paginated-output.js'
import { PaginatedOutput } from '../../../../core/types/paginated-output.js'

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
    const { totalCount, items } = await blogsService.findMany(queryInput)
    const blogsListOutput = mapToPaginatedOutput(
      items,
      {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      },
      mapToBlogListViewModel
    )

    res.json(blogsListOutput)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
