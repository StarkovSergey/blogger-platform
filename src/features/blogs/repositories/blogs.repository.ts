import type { BlogInputModel } from '../models/BlogInputModel.js'
import { blogsCollection } from '../../../db/collections.js'
import { ObjectId, WithId } from 'mongodb'

import { Blog } from '../types/blog.js'

export const blogsRepository = {
  async findAll(): Promise<WithId<Blog>[]> {
    return blogsCollection.find().toArray()
  },
  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) })
  },
  async create(blog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogsCollection.insertOne(blog)
    return { ...blog, _id: insertResult.insertedId }
  },
  async delete(id: string): Promise<boolean> {
    const deleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    })

    return deleteResult.deletedCount > 0
  },
  async update(id: string, dto: BlogInputModel): Promise<boolean> {
    const updatedResult = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: dto }
    )

    return updatedResult.matchedCount > 0
  },
}
