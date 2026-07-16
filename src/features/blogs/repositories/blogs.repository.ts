import type { BlogInputModel } from '../models/BlogInputModel.js'
import { blogsCollection } from '../../../db/collections.js'
import { ObjectId, WithId } from 'mongodb'

import { Blog } from '../types/blog.js'
import { NotFoundException } from '../../../core/exeptions/not-found.exception.js'
import { BlogQueryInput } from '../types/input/blog-query-input.js'
import { escapeRegExp } from '../../../common/helpers/escape-reg-exp.js'

export const blogsRepository = {
  async findMany(queryDto: BlogQueryInput): Promise<{
    items: WithId<Blog>[]
    totalCount: number
  }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto

    const skip = (pageNumber - 1) * pageSize
    const filter: any = {}

    if (searchNameTerm) {
      filter.name = { $regex: escapeRegExp(searchNameTerm), $options: 'i' }
    }

    const [items, totalCount] = await Promise.all([
      blogsCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      blogsCollection.countDocuments(filter),
    ])

    return { items, totalCount }
  },
  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) })
  },
  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    const res = await blogsCollection.findOne({ _id: new ObjectId(id) })

    if (!res) {
      throw new NotFoundException('Blog not found')
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
