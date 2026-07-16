import type {
  ApiResponse,
  RequestWithParams,
} from '../../../../core/types/utils-types.js'
import { PostViewModel } from '../../models/PostViewModel.js'
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'
import { postsService } from '../../application/posts.service.js'

export async function getPostHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<PostViewModel>
) {
  try {
    const id = req.params.id
    const post = await postsService.findByIdOrFailed(id)

    const postViewModel = mapToPostViewModel(post)

    res.json(postViewModel)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
