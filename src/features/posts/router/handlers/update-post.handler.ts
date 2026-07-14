import type {
  ApiResponse,
  RequestWithParamsAndBody,
} from '../../../../common/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { PostInputModel } from '../../models/PostInputModel.js'
import { postsService } from '../../application/posts.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'

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
