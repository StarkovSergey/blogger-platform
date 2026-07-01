import type {
  ApiResponse,
  RequestWithParamsAndBody,
} from '../../../common/types/utils-types.js'
import { blogsRepository } from '../repositories/blogs.repository.js'
import { HttpStatus } from '../../../common/constants/constants.js'
import { createErrorsMessages } from '../../../common/helpers/create-errors-messages.js'
import { BlogInputModel } from '../models/BlogInputModel.js'

export function updateBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>,
  res: ApiResponse<void>
) {
  const id = req.params.id
  const isUpdated = blogsRepository.update(id, req.body)

  if (!isUpdated) {
    res.status(HttpStatus.NOT_FOUND_404).json(
      createErrorsMessages([
        {
          field: 'id',
          message: 'Blog not found',
        },
      ])
    )

    return
  }

  res.sendStatus(HttpStatus.NO_CONTENT_204)
}
