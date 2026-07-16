import { Request, Response } from 'express'
import { PostViewModel } from '../../models/PostViewModel.js'
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.js'
import { postsService } from '../../application/posts.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'
import { RequestWithQuery } from '../../../../core/types/utils-types.js'
import { PostQueryInput } from '../../types/input/post-query-input.js'
import { PaginatedOutput } from '../../../../core/types/paginated-output.js'
import { mapToPaginatedOutput } from '../../../../core/mappers/map-to-paginated-output.js'

export const getPostListHandler = async (
  req: RequestWithQuery<PostQueryInput>,
  res: Response<
    {
      items: PostViewModel[]
    } & PaginatedOutput
  >
) => {
  try {
    const queryInput = req.query
    const { totalCount, items } = await postsService.findMany(queryInput)

    const postsListOutput = mapToPaginatedOutput(
      items,
      {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      },
      mapToPostViewModel
    )

    res.json(postsListOutput)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
