import {
  ApiResponse,
  RequestWithParams,
} from '../../../../common/types/utils-types.js'
import { blogsRepository } from '../../repositories/blogs.repository.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { createErrorsMessages } from '../../../../common/helpers/create-errors-messages.js'

export async function deleteBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<void>
) {
  try {
    const id = req.params.id
    const isDeleted = await blogsRepository.delete(id)

    if (!isDeleted) {
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
