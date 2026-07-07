import { Request, Response } from 'express'
import { PostViewModel } from '../../models/PostViewModel.js'
import { postsRepository } from '../../repositories/posts.repository.js'

export const getPostListHandler = (
  req: Request,
  res: Response<PostViewModel[]>
) => {
  const posts = postsRepository.findAll()
  res.json(posts)
}
