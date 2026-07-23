import { PostInputModel } from '../types/input/PostInputModel.js'
import { ObjectId, WithId } from 'mongodb'
import { PostDB } from '../types/postDB.js'
import { postsCollection } from '../../../db/collections.js'
import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'
import { PostQueryInput } from '../types/input/post-query-input.js'

export const postsRepository = {
  async findMany(queryDto: PostQueryInput): Promise<{
    items: WithId<PostDB>[]
    totalCount: number
  }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto

    const skip = (pageNumber - 1) * pageSize

    const [items, totalCount] = await Promise.all([
      postsCollection
        .find()
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postsCollection.countDocuments(),
    ])

    return { items, totalCount }
  },
  async findById(id: string): Promise<WithId<PostDB> | null> {
    return postsCollection.findOne({ _id: new ObjectId(id) })
  },
  async findByIdOrFail(id: string): Promise<WithId<PostDB>> {
    const res = await postsCollection.findOne({ _id: new ObjectId(id) })

    if (!res) {
      throw new NotFoundException('Post not found')
    }

    return res
  },
  async create(post: PostDB): Promise<string> {
    const insertResult = await postsCollection.insertOne({
      ...post,
    })

    return insertResult.insertedId.toString()
  },
  async delete(id: string): Promise<void> {
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    })

    if (deleteResult.deletedCount < 1) {
      throw new NotFoundException('Post not found')
    }

    return
  },
  async update(id: string, dto: PostInputModel): Promise<void> {
    const updatedResult = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: dto }
    )

    if (updatedResult.matchedCount < 1) {
      throw new NotFoundException('Post not found')
    }

    return
  },
  async countByBlogId(blogId: string): Promise<number> {
    return postsCollection.countDocuments({ blogId })
  },
}
