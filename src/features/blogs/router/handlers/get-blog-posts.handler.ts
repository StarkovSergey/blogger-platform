import { RequestWithParamsAndQuery } from '../../../../core/types/utils-types.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'
import { PostViewModel } from '../../../posts/types/output/PostViewModel.js'
import { PostQueryInput } from '../../../posts/types/input/post-query-input.js'
import { Response } from 'express'
import { Pagination } from '../../../../core/types/paginated-output.js'
import { blogsRepository } from '../../repositories/blogs.repository.js'
import { postsQueryRepository } from '../../../posts/repositories/posts.query.repository.js'
import { blogsQueryRepository } from '../../repositories/blogs.query.repository.js'

export async function getBlogPostsHandler(
  req: RequestWithParamsAndQuery<{ id: string }, PostQueryInput>,
  res: Response<Pagination<PostViewModel>>
) {
  try {
    const blogId = req.params.id
    const queryInput = req.query

    await blogsQueryRepository.findByIdOrFail(blogId) // если блога нет -> ошибка

    const paginatedOutput = await postsQueryRepository.findPostsByBlog(
      blogId,
      queryInput
    )

    res.json(paginatedOutput)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
