import type {
  ApiResponse,
  RequestWithParams,
} from '../../../../common/types/utils-types.js'
import { blogsService } from '../../application/blogs.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'
import { PostViewModel } from '../../../posts/models/PostViewModel.js'
import { mapToPostViewModel } from '../../../posts/router/mappers/map-to-post-view-model.js'

export async function getBlogPostsHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<PostViewModel[]>
) {
  try {
    const blogId = req.params.id

    const posts = await blogsService.findPostsByBlog(blogId)
    const postViewModels = posts.map(mapToPostViewModel)

    res.json(postViewModels)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
