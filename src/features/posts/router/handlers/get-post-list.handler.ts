import { Request, Response } from 'express'
import { PostViewModel } from '../../models/PostViewModel.js'
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.js'
import { postsService } from '../../application/posts.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'

export const getPostListHandler = async (
  req: Request,
  res: Response<PostViewModel[]>
) => {
  try {
    const posts = await postsService.findMany()

    const postViewModels = posts.map(mapToPostViewModel)

    res.json(postViewModels)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
