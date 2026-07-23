import type {
  ApiResponse,
  RequestWithParams,
} from '../../../../core/types/utils-types.js'
import type { BlogViewModel } from '../../types/output/BlogViewModel.js'
import { errorsHandlers } from '../../../../core/exceptions/errors-handlers.js'
import { blogsQueryRepository } from '../../repositories/blogs.query.repository.js'

export async function getBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<BlogViewModel>
) {
  try {
    const id = req.params.id
    const blog = await blogsQueryRepository.findByIdOrFail(id)

    res.json(blog)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
