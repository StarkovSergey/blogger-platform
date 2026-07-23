import type { BlogInputModel } from '../types/input/BlogInputModel.js'
import { blogsCollection } from '../../../db/collections.js'
import { ObjectId, WithId } from 'mongodb'

import { BlogDB } from '../types/blogDB.js'
import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'

export const blogsRepository = {
  async findByIdOrFail(id: string): Promise<WithId<BlogDB>> {
    const res = await blogsCollection.findOne({ _id: new ObjectId(id) })

    if (!res) {
      throw new NotFoundException('Blog not found')
    }

    return res
  },
  async create(blog: BlogDB): Promise<string> {
    const insertResult = await blogsCollection.insertOne(blog)
    return insertResult.insertedId.toString()
  },
  async delete(id: string): Promise<void> {
    const deleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    })

    if (deleteResult.deletedCount < 1) {
      throw new NotFoundException('Blog not found')
    }

    return
  },
  async update(id: string, dto: BlogInputModel): Promise<void> {
    const updatedResult = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: dto }
    )

    if (updatedResult.matchedCount < 1) {
      throw new NotFoundException('Blog not found')
    }

    return
  },
}
