import { PostInputModel } from '../types/input/PostInputModel.js'
import { WithId } from 'mongodb'
import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'
import { injectable } from 'inversify'
import { PostDB, postModel } from '../domain/post.schema.js'

@injectable()
export class PostsRepository {
  async findById(id: string): Promise<WithId<PostDB> | null> {
    return postModel.findById(id).lean()
  }
  async findByIdOrFail(id: string): Promise<WithId<PostDB>> {
    const res = await postModel.findById(id).lean()

    if (!res) {
      throw new NotFoundException('Post not found')
    }

    return res
  }
  async create(post: PostDB): Promise<string> {
    const res = await postModel.create(post)

    return res._id.toString()
  }
  async delete(id: string): Promise<void> {
    const deleteResult = await postModel.findByIdAndDelete(id)

    if (!deleteResult) {
      throw new NotFoundException('Post not found')
    }

    return
  }
  async update(id: string, dto: PostInputModel): Promise<void> {
    const updatedResult = await postModel.findByIdAndUpdate(id, dto)

    if (!updatedResult) {
      throw new NotFoundException('Post not found')
    }

    return
  }
  async countByBlogId(blogId: string): Promise<number> {
    return postModel.countDocuments({ blogId })
  }
}
