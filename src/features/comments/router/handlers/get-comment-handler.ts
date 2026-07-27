import type {
  ApiResponse,
  RequestWithParams,
} from '../../../../core/types/utils-types.js'
import { CommentViewModel } from '../../types/output/CommentViewModel.js'
import { commentsQueryRepository } from '../../repositories/comments.query.repository.js'
import { HttpStatus } from '../../../../common/constants/constants.js'

export async function getCommentHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<CommentViewModel>
) {
  try {
    const id = req.params.id
    const comment = await commentsQueryRepository.findById(id)

    if (!comment) {
      res.sendStatus(HttpStatus.NOT_FOUND_404)
      return
    }

    return res.status(HttpStatus.OK_200).json(comment)
  } catch (e) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
