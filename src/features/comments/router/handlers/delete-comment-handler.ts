import {
  ApiResponse,
  RequestWithParams,
} from '../../../../core/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { commentsService } from '../../services/comments.service.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'

export async function deleteCommentHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<void>
) {
  try {
    const id = req.params.id
    const userId = req.user?.id as string

    const result = await commentsService.delete(id, userId)

    if (result.status !== ResultStatus.Success) {
      return res
        .status(resultStatusToHttpStatusCode(result.status))
        .json({ errorsMessages: result.extensions })
    }

    res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch (e) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
