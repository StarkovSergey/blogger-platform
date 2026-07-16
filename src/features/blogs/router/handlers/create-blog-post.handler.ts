import { Response } from 'express'
import { type RequestWithParamsAndBody } from '../../../../core/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { blogsService } from '../../application/blogs.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'
import { BlogPostInputModel } from '../../models/BlogPostInputModel.js'
import { PostViewModel } from '../../../posts/models/PostViewModel.js'
import { mapToPostViewModel } from '../../../posts/router/mappers/map-to-post-view-model.js'

export async function createBlogPostHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogPostInputModel>,
  res: Response<PostViewModel>
) {
  try {
    const blogId = req.params.id

    const createdPost = await blogsService.createBlogPost(blogId, req.body)

    const postViewModel = mapToPostViewModel(createdPost)
    res.status(HttpStatus.CREATED_201).json(postViewModel)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
