import { PostInputModel } from '../models/PostInputModel.js'
import { ObjectId, WithId } from 'mongodb'
import { Post } from '../types/post.js'
import { postsCollection } from '../../../db/collections.js'
import { NotFoundException } from '../../../core/exeptions/not-found.exception.js'
import { PostQueryInput } from '../types/input/post-query-input.js'

export const postsRepository = {
  async findMany(queryDto: PostQueryInput): Promise<{
    items: WithId<Post>[]
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
  async findById(id: string): Promise<WithId<Post> | null> {
    return postsCollection.findOne({ _id: new ObjectId(id) })
  },
  async findByIdOrFailed(id: string): Promise<WithId<Post>> {
    const res = await postsCollection.findOne({ _id: new ObjectId(id) })

    if (!res) {
      throw new NotFoundException('Post not found')
    }

    return res
  },
  async findPostsByBlog(blogId: string): Promise<WithId<Post>[]> {
    return postsCollection
      .find({
        blogId,
      })
      .toArray()
  },
  async create(post: Post): Promise<WithId<Post>> {
    const insertResult = await postsCollection.insertOne({
      ...post,
    })

    return {
      ...post,
      _id: insertResult.insertedId,
    }
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
}
