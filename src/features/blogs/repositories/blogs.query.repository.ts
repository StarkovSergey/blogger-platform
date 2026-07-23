import { BlogQueryInput } from '../types/input/blog-query-input.js'
import { ObjectId, WithId } from 'mongodb'
import { BlogDB } from '../types/blogDB.js'
import { escapeRegExp } from '../../../common/helpers/escape-reg-exp.js'
import { blogsCollection } from '../../../db/collections.js'
import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'
import { BlogViewModel } from '../types/output/BlogViewModel.js'
import { Pagination } from '../../../core/types/paginated-output.js'

export const blogsQueryRepository = {
  async findMany(queryDto: BlogQueryInput): Promise<Pagination<BlogViewModel>> {
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

    return {
      items: items.map(this._mapToBlogListViewModel),
      totalCount,
      pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
    }
  },
  async findById(id: string): Promise<WithId<BlogDB> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) })
  },
  async findByIdOrFail(id: string): Promise<BlogViewModel> {
    const res = await blogsCollection.findOne({ _id: new ObjectId(id) })

    if (!res) {
      throw new NotFoundException('Blog not found')
    }

    return this._mapToBlogListViewModel(res)
  },
  _mapToBlogListViewModel(blog: WithId<BlogDB>): BlogViewModel {
    return {
      id: blog._id.toString(),
      websiteUrl: blog.websiteUrl,
      description: blog.description,
      name: blog.name,
      createdAt: blog.createdAt.toISOString(),
      isMembership: blog.isMembership,
    }
  },
}
