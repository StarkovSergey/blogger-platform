import type {
  RequestWithParams,
  ApiResponse,
} from '../../../../common/types/utils-types.js'
import { blogsRepository } from '../../repositories/blogs.repository.js'
import { createErrorsMessages } from '../../../../common/helpers/create-errors-messages.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import type { BlogViewModel } from '../../models/BlogViewModel.js'
import { mapToBlogListViewModel } from '../mappers/map-to-blog-list-view-model.js'

export async function getBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<BlogViewModel>
) {
  try {
    const id = req.params.id
    const blog = await blogsRepository.findById(id)

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

    const blogViewModel = mapToBlogListViewModel(blog)

    res.json(blogViewModel)
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
