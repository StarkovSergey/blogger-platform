import type {
  ApiResponse,
  RequestWithParamsAndBody,
} from '../../../../core/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { BlogInputModel } from '../../types/input/BlogInputModel.js'
import { blogsService } from '../../services/blogs.service.js'
import { errorsHandlers } from '../../../../core/exceptions/errors-handlers.js'

// TODO: при обновлении имени блока - обновить имя блога в постах этого блога

export async function updateBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>,
  res: ApiResponse<void>
) {
  try {
    const id = req.params.id
    await blogsService.update(id, req.body)

    res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
