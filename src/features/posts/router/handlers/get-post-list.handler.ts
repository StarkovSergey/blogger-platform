import { Request, Response } from 'express'
import { PostViewModel } from '../../models/PostViewModel.js'
import { postsRepository } from '../../repositories/posts.repository.js'
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.js'
import { HttpStatus } from '../../../../common/constants/constants.js'

export const getPostListHandler = async (
  req: Request,
  res: Response<PostViewModel[]>
) => {
  try {
    const posts = await postsRepository.findAll()

    const postViewModels = posts.map(mapToPostViewModel)

    res.json(postViewModels)
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
