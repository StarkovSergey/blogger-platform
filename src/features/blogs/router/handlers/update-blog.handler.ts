import type {
  ApiResponse,
  RequestWithParamsAndBody,
} from '../../../../common/types/utils-types.js'
import { blogsRepository } from '../../repositories/blogs.repository.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { createErrorsMessages } from '../../../../common/helpers/create-errors-messages.js'
import { BlogInputModel } from '../../models/BlogInputModel.js'

export async function updateBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>,
  res: ApiResponse<void>
) {
  try {
    const id = req.params.id
    const isUpdated = await blogsRepository.update(id, req.body)

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
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
