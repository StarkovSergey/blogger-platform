import type {
  RequestWithParams,
  ApiResponse,
} from '../../../../common/types/utils-types.js'
import { createErrorsMessages } from '../../../../common/helpers/create-errors-messages.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { PostViewModel } from '../../models/PostViewModel.js'
import { postsRepository } from '../../repositories/posts.repository.js'
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.js'

export async function getPostHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<PostViewModel>
) {
  try {
    const id = req.params.id
    const post = await postsRepository.findById(id)

    if (!post) {
      res.status(HttpStatus.NOT_FOUND_404).json(
        createErrorsMessages([
          {
            field: 'id',
            message: 'Post not found',
          },
        ])
      )

      return
    }

    const postViewModel = mapToPostViewModel(post)

    res.json(postViewModel)
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
