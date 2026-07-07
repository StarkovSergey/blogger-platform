import type {
  RequestWithBody,
  ApiResponse,
} from '../../../../common/types/utils-types.js'
import { PostInputModel } from '../../models/PostInputModel.js'
import { PostViewModel } from '../../models/PostViewModel.js'
import { postsRepository } from '../../repositories/posts.repository.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { createErrorsMessages } from '../../../../common/helpers/create-errors-messages.js'

export const createPostHandler = (
  req: RequestWithBody<PostInputModel>,
  res: ApiResponse<PostViewModel>
) => {
  const createdPost = postsRepository.create(req.body)

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

  res.status(HttpStatus.CREATED_201).json(createdPost)
}
