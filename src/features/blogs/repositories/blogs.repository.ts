import type { BlogInputModel } from '../models/BlogInputModel.js'
import { blogsCollection } from '../../../db/collections.js'
import { ObjectId, WithId } from 'mongodb'

import { Blog } from '../types/blog.js'
import { NotFoundException } from '../../../core/exeptions/not-found.exception.js'

export const blogsRepository = {
  async findMany(): Promise<WithId<Blog>[]> {
    return blogsCollection.find().toArray()
  },
  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) })
  },
  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    const res = await blogsCollection.findOne({ _id: new ObjectId(id) })

    if (!res) {
      throw new NotFoundException('Blog not found', 'id')
    }

    return res
  },
  async create(blog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogsCollection.insertOne(blog)
    return { ...blog, _id: insertResult.insertedId }
  },
  async delete(id: string): Promise<void> {
    const deleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    })

    if (deleteResult.deletedCount < 1) {
      throw new NotFoundException('Blog not found', 'id')
    }

    return
  },
  async update(id: string, dto: BlogInputModel): Promise<void> {
    const updatedResult = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: dto }
    )

    if (updatedResult.matchedCount < 1) {
      throw new NotFoundException('Blog not found', 'id')
    }

    return
  },
}
