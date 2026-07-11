import { Response } from 'express'
import { RequestWithBody } from '../../../../common/types/utils-types.js'
import { BlogInputModel } from '../../models/BlogInputModel.js'
import { BlogViewModel } from '../../models/BlogViewModel.js'
import { blogsRepository } from '../../repositories/blogs.repository.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { mapToBlogListViewModel } from '../mappers/map-to-blog-list-view-model.js'
import { Blog } from '../../types/blog.js'

export async function createBlogHandler(
  req: RequestWithBody<BlogInputModel>,
  res: Response<BlogViewModel>
) {
  try {
    const newBlog: Blog = {
      ...req.body,
      createdAt: new Date(),
    }

    const createdBlog = await blogsRepository.create(newBlog)
    const blogViewModel = mapToBlogListViewModel(createdBlog)
    res.status(HttpStatus.CREATED_201).json(blogViewModel)
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
