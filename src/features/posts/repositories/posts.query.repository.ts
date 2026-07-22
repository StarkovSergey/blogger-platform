import { ObjectId, WithId } from 'mongodb'
import { Post } from '../types/post.js'
import { postsCollection } from '../../../db/collections.js'
import { NotFoundException } from '../../../core/exeptions/not-found.exception.js'
import { PostViewModel } from '../models/PostViewModel.js'
import { PostQueryInput } from '../types/input/post-query-input.js'
import { Pagination } from '../../../core/types/paginated-output.js'

export const postsQueryRepository = {
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
  _mapToPostViewModel(post: WithId<Post>): PostViewModel {
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
