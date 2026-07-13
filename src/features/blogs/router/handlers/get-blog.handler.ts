import type {
  ApiResponse,
  RequestWithParams,
} from '../../../../common/types/utils-types.js'
import type { BlogViewModel } from '../../models/BlogViewModel.js'
import { mapToBlogListViewModel } from '../mappers/map-to-blog-list-view-model.js'
import { blogsService } from '../../application/blogs.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers'

export async function getBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<BlogViewModel>
) {
  try {
    const id = req.params.id
    const blog = await blogsService.findByIdOrFail(id)

    const blogViewModel = mapToBlogListViewModel(blog)

    res.json(blogViewModel)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
