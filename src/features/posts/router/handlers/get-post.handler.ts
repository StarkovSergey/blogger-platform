import type {
  ApiResponse,
  RequestWithParams,
} from '../../../../common/types/utils-types.js'
import { PostViewModel } from '../../models/PostViewModel.js'
import { postsRepository } from '../../repositories/posts.repository.js'
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'

export async function getPostHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<PostViewModel>
) {
  try {
    const id = req.params.id
    const post = await postsRepository.findByIdOrFailed(id)

    const postViewModel = mapToPostViewModel(post)

    res.json(postViewModel)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
