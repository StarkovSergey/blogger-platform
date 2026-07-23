import { Response } from 'express'
import { PostViewModel } from '../../types/output/PostViewModel.js'
import { errorsHandlers } from '../../../../core/exceptions/errors-handlers.js'
import { RequestWithQuery } from '../../../../core/types/utils-types.js'
import { PostQueryInput } from '../../types/input/post-query-input.js'
import { PaginatedOutput } from '../../../../core/types/paginated-output.js'
import { postsQueryRepository } from '../../repositories/posts.query.repository.js'

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
    const paginatedOutput = await postsQueryRepository.findMany(queryInput)

    res.json(paginatedOutput)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
