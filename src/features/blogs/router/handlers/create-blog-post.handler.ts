import { Response } from 'express'
import { type RequestWithParamsAndBody } from '../../../../core/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { blogsService } from '../../application/blogs.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'
import { BlogPostInputModel } from '../../models/BlogPostInputModel.js'
import { PostViewModel } from '../../../posts/models/PostViewModel.js'
import { postsQueryRepository } from '../../../posts/repositories/posts.query.repository.js'

export async function createBlogPostHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogPostInputModel>,
  res: Response<PostViewModel>
) {
  try {
    const blogId = req.params.id

    const createdPostId = await blogsService.createBlogPost(blogId, req.body)
    const createdPost =
      await postsQueryRepository.findByIdOrFailed(createdPostId)

    res.status(HttpStatus.CREATED_201).json(createdPost)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
