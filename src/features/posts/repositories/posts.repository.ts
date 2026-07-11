import { PostInputModel } from '../models/PostInputModel.js'
import { ObjectId, WithId } from 'mongodb'
import { Post } from '../types/post.js'
import { blogsCollection, postsCollection } from '../../../db/collections.js'

export const postsRepository = {
  async findAll(): Promise<WithId<Post>[]> {
    return postsCollection.find().toArray()
  },
  async findById(id: string): Promise<WithId<Post> | null> {
    return postsCollection.findOne({ _id: new ObjectId(id) })
  },
  async create(post: Omit<Post, 'blogName'>): Promise<WithId<Post> | null> {
    const blog = await blogsCollection.findOne({
      _id: new ObjectId(post.blogId),
    })

    if (!blog) {
      return null
    }

    const insertResult = await postsCollection.insertOne({
      ...post,
      blogName: blog.name,
    })

    return {
      ...post,
      blogName: blog.name,
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
