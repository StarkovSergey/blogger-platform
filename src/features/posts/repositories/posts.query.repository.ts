import { ObjectId, WithId } from 'mongodb'
import { PostDB } from '../types/postDB.js'
import { postsCollection } from '../../../db/collections.js'
import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'
import { PostViewModel } from '../types/output/PostViewModel.js'
import { PostQueryInput } from '../types/input/post-query-input.js'
import { Pagination } from '../../../core/types/paginated-output.js'

export const postsQueryRepository = {
  async findMany(queryDto: PostQueryInput): Promise<Pagination<PostViewModel>> {
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

    return {
      items: items.map(this._mapToPostViewModel),
      totalCount,
      pageSize,
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
    }
  },
  async findByIdOrFailed(id: string): Promise<PostViewModel> {
    const res = await postsCollection.findOne({ _id: new ObjectId(id) })

    if (!res) {
      throw new NotFoundException('Post not found')
    }

    return this._mapToPostViewModel(res)
  },
  async findPostsByBlog(
    blogId: string,
    queryDto: PostQueryInput
  ): Promise<Pagination<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto
    const skip = (pageNumber - 1) * pageSize

    const [items, totalCount] = await Promise.all([
      postsCollection
        .find({
          blogId,
        })
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postsCollection.countDocuments({ blogId }),
    ])

    return {
      items: items.map(this._mapToPostViewModel),
      totalCount,
      pageSize,
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
    }
  },
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
  },
}
