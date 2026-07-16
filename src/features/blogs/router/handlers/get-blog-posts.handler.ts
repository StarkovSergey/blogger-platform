import { RequestWithParamsAndQuery } from '../../../../core/types/utils-types.js'
import { blogsService } from '../../application/blogs.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'
import { PostViewModel } from '../../../posts/models/PostViewModel.js'
import { mapToPostViewModel } from '../../../posts/router/mappers/map-to-post-view-model.js'
import { PostQueryInput } from '../../../posts/types/input/post-query-input.js'
import { mapToPaginatedOutput } from '../../../../core/mappers/map-to-paginated-output.js'
import { Response } from 'express'
import { PaginatedOutput } from '../../../../core/types/paginated-output.js'

export async function getBlogPostsHandler(
  req: RequestWithParamsAndQuery<{ id: string }, PostQueryInput>,
  res: Response<
    {
      items: PostViewModel[]
    } & PaginatedOutput
  >
) {
  try {
    const blogId = req.params.id
    const queryInput = req.query

    const { totalCount, items } = await blogsService.findPostsByBlog(
      blogId,
      queryInput
    )

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
