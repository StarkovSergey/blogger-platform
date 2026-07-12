import { Request, Response } from 'express'
import { blogsRepository } from '../../repositories/blogs.repository.js'
import { BlogViewModel } from '../../models/BlogViewModel.js'
import { mapToBlogListViewModel } from '../mappers/map-to-blog-list-view-model.js'
import { HttpStatus } from '../../../../common/constants/constants.js'

export const getBlogListHandler = async (
  req: Request,
  res: Response<BlogViewModel[]>
) => {
  console.log('getBlogListHandler')
  try {
    const blogs = await blogsRepository.findAll()
    console.log('blogs', blogs)
    const blogsViewModels = blogs.map(mapToBlogListViewModel)
    res.json(blogsViewModels)
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
