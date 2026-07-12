import type {
  ApiResponse,
  RequestWithParamsAndBody,
} from '../../../../common/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { createErrorsMessages } from '../../../../common/helpers/create-errors-messages.js'
import { postsRepository } from '../../repositories/posts.repository.js'
import { PostInputModel } from '../../models/PostInputModel.js'
import { blogsRepository } from '../../../blogs/repositories/blogs.repository.js'

export async function updatePostHandler(
  req: RequestWithParamsAndBody<{ id: string }, PostInputModel>,
  res: ApiResponse<void>
) {
  try {
    const blogId = req.body.blogId
    const blog = await blogsRepository.findById(blogId)
    if (!blog) {
      res.status(HttpStatus.NOT_FOUND_404).json(
        createErrorsMessages([
          {
            field: 'blogId',
            message: 'Blog not found',
          },
        ])
      )
    }

    const id = req.params.id
    const isUpdated = await postsRepository.update(id, req.body)

    if (!isUpdated) {
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

    res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
