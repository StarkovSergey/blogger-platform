import { WithId } from 'mongodb'
import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'
import { PostViewModel } from '../types/output/PostViewModel.js'
import { PostQueryInput } from '../types/input/post-query-input.js'
import { Pagination } from '../../../core/types/paginated-output.js'
import { injectable } from 'inversify'
import { PostDB, postModel } from '../domain/post.schema.js'

@injectable()
export class PostsQueryRepository {
  async findMany(queryDto: PostQueryInput): Promise<Pagination<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto

    const skip = (pageNumber - 1) * pageSize

    const [items, totalCount] = await Promise.all([
      postModel
        .find()
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      postModel.countDocuments(),
    ])

    return {
      items: items.map(this._mapToPostViewModel),
      totalCount,
      pageSize,
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
    }
  }

  async findByIdOrFailed(id: string): Promise<PostViewModel> {
    const res = await postModel.findById(id).lean()

    if (!res) {
      throw new NotFoundException('Post not found')
    }

    return this._mapToPostViewModel(res)
  }

  async findPostsByBlog(
    blogId: string,
    queryDto: PostQueryInput
  ): Promise<Pagination<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto
    const skip = (pageNumber - 1) * pageSize

    const [items, totalCount] = await Promise.all([
      postModel
        .find({
          blogId,
        })
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      postModel.countDocuments({ blogId }),
    ])

    return {
      items: items.map(this._mapToPostViewModel),
      totalCount,
      pageSize,
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
    }
  }

  _mapToPostViewModel(post: WithId<PostDB>): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      shortDescription: post.shortDescription,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt.toISOString(),
    }
  }
}
