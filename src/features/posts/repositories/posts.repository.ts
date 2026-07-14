import { PostInputModel } from '../models/PostInputModel.js'
import { ObjectId, WithId } from 'mongodb'
import { Post } from '../types/post.js'
import { postsCollection } from '../../../db/collections.js'
import { NotFoundException } from '../../../core/exeptions/not-found.exception.js'

export const postsRepository = {
  async findMany(): Promise<WithId<Post>[]> {
    return postsCollection.find().toArray()
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
  async delete(id: string): Promise<boolean> {
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    })

    return deleteResult.deletedCount > 0
  },
  async update(id: string, dto: PostInputModel): Promise<boolean> {
    const updatedResult = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: dto }
    )

    return updatedResult.matchedCount > 0
  },
}
