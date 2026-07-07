import {
  ApiResponse,
  RequestWithParams,
} from '../../../../common/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { createErrorsMessages } from '../../../../common/helpers/create-errors-messages.js'
import { postsRepository } from '../../repositories/posts.repository.js'

export function deletePostHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<void>
) {
  const id = req.params.id
  const isDeleted = postsRepository.delete(id)

  if (!isDeleted) {
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
