import type {
  RequestWithBody,
  ApiResponse,
} from '../../../../common/types/utils-types.js'
import { PostInputModel } from '../../models/PostInputModel.js'
import { PostViewModel } from '../../models/PostViewModel.js'
import { postsRepository } from '../../repositories/posts.repository.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { createErrorsMessages } from '../../../../common/helpers/create-errors-messages.js'
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.js'

export const createPostHandler = async (
  req: RequestWithBody<PostInputModel>,
  res: ApiResponse<PostViewModel>
) => {
  try {
    const createdPost = await postsRepository.create(req.body)

    if (!createdPost) {
      res.status(HttpStatus.NOT_FOUND_404).json(
        createErrorsMessages([
          {
            field: 'blogId',
            message: 'Blog not found',
          },
        ])
      )
      return
    }

    const postViewModel = mapToPostViewModel(createdPost)

    res.status(HttpStatus.CREATED_201).json(postViewModel)
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
