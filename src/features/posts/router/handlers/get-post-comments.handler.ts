import { Response } from 'express'
import { RequestWithParamsAndQuery } from '../../../../core/types/utils-types.js'
import { PaginatedOutput } from '../../../../core/types/paginated-output.js'
import { CommentQueryInput } from '../../../comments/types/input/comment-query-input.js'
import { CommentViewModel } from '../../../comments/types/output/CommentViewModel.js'
import { errorsHandlers } from '../../../../core/exceptions/errors-handlers.js'
import {
  commentsQueryRepository,
  postsQueryRepository,
} from '../../../../composition-root.js'

export const getPostCommentsHandler = async (
  req: RequestWithParamsAndQuery<{ id: string }, CommentQueryInput>,
  res: Response<
    {
      items: CommentViewModel[]
    } & PaginatedOutput
  >
) => {
  try {
    const queryInput = req.query
    const postId = req.params.id

    await postsQueryRepository.findByIdOrFailed(postId) // если поста нет → 404

    const paginatedOutput = await commentsQueryRepository.findCommentsByPostId(
      postId,
      queryInput
    )

    res.json(paginatedOutput)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
