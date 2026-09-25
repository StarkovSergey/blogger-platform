import type { BlogInputModel } from '../types/input/BlogInputModel.js'
import { WithId } from 'mongodb'

import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'
import { injectable } from 'inversify'
import { BlogDB, BlogDocument, blogModel } from '../domain/blog.schema.js'

@injectable()
export class BlogsRepository {
  async save(blog: BlogDocument) {
    return await blog.save()
  }

  async findByIdOrFail(id: string): Promise<WithId<BlogDB>> {
    const res = await blogModel.findById(id).lean()
    if (!res) {
      throw new NotFoundException('Blog not found')
    }

    return res
  }

  async create(blog: BlogDB): Promise<string> {
    const res = await blogModel.create(blog)
    return res._id.toString()
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await blogModel.findByIdAndDelete(id)

    if (!deleteResult) {
      throw new NotFoundException('Blog not found')
    }

    return
  }

  async update(id: string, dto: BlogInputModel): Promise<void> {
    const updatedResult = await blogModel.findByIdAndUpdate(id, dto)

    if (!updatedResult) {
      throw new NotFoundException('Blog not found')
    }

    return
  }
}
