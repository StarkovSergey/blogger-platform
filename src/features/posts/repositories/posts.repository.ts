import { PostInputModel } from '../types/input/PostInputModel.js'
import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'
import { injectable } from 'inversify'
import { PostDB, PostDocument, PostModel } from '../domain/post.schema.js'

@injectable()
export class PostsRepository {
  async save(post: PostDocument) {
    return post.save()
  }
  async findById(id: string): Promise<PostDocument | null> {
    return PostModel.findById(id)
  }
  async findByIdOrFail(id: string): Promise<PostDocument> {
    const res = await PostModel.findById(id)

    if (!res) {
      throw new NotFoundException('Post not found')
    }

    return res
  }
  async create(post: PostDB): Promise<string> {
    const res = await PostModel.create(post)

    return res._id.toString()
  }
  async delete(id: string): Promise<void> {
    const deleteResult = await PostModel.findByIdAndDelete(id)

    if (!deleteResult) {
      throw new NotFoundException('Post not found')
    }

    return
  }
  async update(id: string, dto: PostInputModel): Promise<void> {
    const updatedResult = await PostModel.findByIdAndUpdate(id, dto)

    if (!updatedResult) {
      throw new NotFoundException('Post not found')
    }

    return
  }
  async countByBlogId(blogId: string): Promise<number> {
    return PostModel.countDocuments({ blogId })
  }
}
