import type {
  ApiResponse,
  RequestWithParamsAndBody,
} from '../../../../common/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { createErrorsMessages } from '../../../../common/helpers/create-errors-messages.js'
import { postsRepository } from '../../repositories/posts.repository.js'
import { PostInputModel } from '../../models/PostInputModel.js'

export function updatePostHandler(
  req: RequestWithParamsAndBody<{ id: string }, PostInputModel>,
  res: ApiResponse<void>
) {
  const id = req.params.id
  const isUpdated = postsRepository.update(id, req.body)

  if (!isUpdated) {
    res.status(HttpStatus.NOT_FOUND_404).json(
      createErrorsMessages([
        {
          field: 'id',
          message: 'Post not found',
        },
      ])
    )

    return
  }

  res.sendStatus(HttpStatus.NO_CONTENT_204)
}
