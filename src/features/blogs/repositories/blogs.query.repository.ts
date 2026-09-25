import { BlogQueryInput } from '../types/input/blog-query-input.js'
import { WithId } from 'mongodb'
import { escapeRegExp } from '../../../common/helpers/escape-reg-exp.js'
import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'
import { BlogViewModel } from '../types/output/BlogViewModel.js'
import { Pagination } from '../../../core/types/paginated-output.js'
import { injectable } from 'inversify'
import { BlogDB, blogModel } from '../domain/blog.schema.js'

@injectable()
export class BlogsQueryRepository {
  async findMany(queryDto: BlogQueryInput): Promise<Pagination<BlogViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto

    const skip = (pageNumber - 1) * pageSize
    const filter: any = {}

    if (searchNameTerm) {
      filter.name = { $regex: escapeRegExp(searchNameTerm), $options: 'i' }
    }

    const [items, totalCount] = await Promise.all([
      blogModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      blogModel.countDocuments(filter),
    ])

    return {
      items: items.map(this._mapToBlogListViewModel),
      totalCount,
      pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
    }
  }

  async findById(id: string): Promise<WithId<BlogDB> | null> {
    return blogModel.findById(id).lean()
  }

  async findByIdOrFail(id: string): Promise<BlogViewModel> {
    const res = await blogModel.findById(id).lean()

    if (!res) {
      throw new NotFoundException('Blog not found')
    }

    return this._mapToBlogListViewModel(res)
  }

  _mapToBlogListViewModel(blog: WithId<BlogDB>): BlogViewModel {
    return {
      id: blog._id.toString(),
      websiteUrl: blog.websiteUrl,
      description: blog.description,
      name: blog.name,
      createdAt: blog.createdAt.toISOString(),
      isMembership: blog.isMembership,
    }
  }
}
