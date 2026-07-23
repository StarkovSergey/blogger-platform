import type {
  ApiResponse,
  RequestWithParamsAndBody,
} from '../../../../core/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { PostInputModel } from '../../types/input/PostInputModel.js'
import { postsService } from '../../services/posts.service.js'
import { errorsHandlers } from '../../../../core/exceptions/errors-handlers.js'

export async function updatePostHandler(
  req: RequestWithParamsAndBody<{ id: string }, PostInputModel>,
  res: ApiResponse<void>
) {
  try {
    const id = req.params.id
    await postsService.update(id, req.body)

    res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
