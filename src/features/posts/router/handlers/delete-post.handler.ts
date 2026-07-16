import {
  ApiResponse,
  RequestWithParams,
} from '../../../../core/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { postsService } from '../../application/posts.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'

export async function deletePostHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<void>
) {
  try {
    const id = req.params.id
    await postsService.deletePost(id)

    res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
