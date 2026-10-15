import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'
import { injectable } from 'inversify'
import { BlogDocument, BlogModel } from '../domain/blog.schema.js'

@injectable()
export class BlogsRepository {
  async save(blog: BlogDocument) {
    return await blog.save()
  }

  async findByIdOrFail(id: string): Promise<BlogDocument> {
    const res = await BlogModel.findById(id)
    if (!res) {
      throw new NotFoundException('Blog not found')
    }

    return res
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await BlogModel.findByIdAndDelete(id)

    if (!deleteResult) {
      throw new NotFoundException('Blog not found')
    }

    return
  }
}
