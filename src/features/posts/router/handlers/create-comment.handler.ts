import type {
  ApiResponse,
  RequestWithParamsAndBody,
} from '../../../../core/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { CommentInputModel } from '../../../comments/types/input/CommentInputModel.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'
import { CommentViewModel } from '../../../comments/types/output/CommentViewModel.js'
import {
  commentsQueryRepository,
  commentsService,
} from '../../../../composition-root.js'

export const createCommentHandler = async (
  req: RequestWithParamsAndBody<{ id: string }, CommentInputModel>,
  res: ApiResponse<CommentViewModel>
) => {
  try {
    const postId = req.params.id
    const dto = req.body
    const userId = req.user?.id as string

    const result = await commentsService.create({ postId, dto, userId })

    if (result.status !== ResultStatus.Success) {
      return res.status(resultStatusToHttpStatusCode(result.status)).send({
        errorsMessages: result.extensions,
      })
    }

    const createdCommentId = result.data

    const comment = await commentsQueryRepository.findById(createdCommentId)

    if (!comment) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
    }

    res.status(HttpStatus.CREATED_201).json(comment)
  } catch (e) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
