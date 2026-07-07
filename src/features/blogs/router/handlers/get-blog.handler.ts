import type {
  RequestWithParams,
  ApiResponse,
} from '../../../../common/types/utils-types.js'
import { blogsRepository } from '../../repositories/blogs.repository.js'
import { createErrorsMessages } from '../../../../common/helpers/create-errors-messages.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import type { BlogViewModel } from '../../models/BlogViewModel.js'

export function getBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<BlogViewModel>
) {
  const id = req.params.id
  const blog = blogsRepository.findById(id)

  if (!blog) {
    res.status(HttpStatus.NOT_FOUND_404).json(
      createErrorsMessages([
        {
          field: 'id',
          message: 'Blog not found',
        },
      ])
    )

    return
  }

  res.json(blog)
}
