import { Response } from 'express'
import { RequestWithBody } from '../../../common/types/utils-types.js'
import { BlogInputModel } from '../models/BlogInputModel.js'
import { BlogViewModel } from '../models/BlogViewModel.js'

export function createBlogHandler(
  req: RequestWithBody<BlogInputModel>,
  res: Response<BlogViewModel>
) {}
