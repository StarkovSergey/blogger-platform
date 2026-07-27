import type {
  ApiResponse,
  RequestWithParamsAndBody,
} from '../../../../core/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { CommentInputModel } from '../../types/input/CommentInputModel.js'
import { commentsService } from '../../services/comments.service.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'

export async function updateCommentHandler(
  req: RequestWithParamsAndBody<{ id: string }, CommentInputModel>,
  res: ApiResponse<void>
) {
  try {
    const commentId = req.params.id
    const userId = req.user?.id as string

    const result = await commentsService.update({
      id: commentId,
      dto: req.body,
      userId,
    })

    if (result.status !== ResultStatus.Success) {
      return res.status(resultStatusToHttpStatusCode(result.status)).json({
        errorsMessages: result.extensions,
      })
    }

    res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch (e) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
