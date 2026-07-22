import type {
  ApiResponse,
  RequestWithParams,
} from '../../../../core/types/utils-types.js'
import { PostViewModel } from '../../types/output/PostViewModel.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'
import { postsQueryRepository } from '../../repositories/posts.query.repository.js'

export async function getPostHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<PostViewModel>
) {
  try {
    const id = req.params.id
    const post = await postsQueryRepository.findByIdOrFailed(id)

    res.json(post)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
