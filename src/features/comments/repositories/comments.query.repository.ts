import { WithId } from 'mongodb'
import { CommentViewModel } from '../types/output/CommentViewModel.js'
import { CommentQueryInput } from '../types/input/comment-query-input.js'
import { Pagination } from '../../../core/types/paginated-output.js'
import { injectable } from 'inversify'
import { CommentDB, commentModel } from '../domain/comment.schema.js'

@injectable()
export class CommentsQueryRepository {
  async findById(id: string): Promise<CommentViewModel | null> {
    const comment = await commentModel.findById(id).lean()
    return comment ? this._mapToCommentViewModel(comment) : null
  }

  async findCommentsByPostId(
    postId: string,
    queryDto: CommentQueryInput
  ): Promise<Pagination<CommentViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto
    const skip = (pageNumber - 1) * pageSize

    const [items, totalCount] = await Promise.all([
      commentModel
        .find({
          postId,
        })
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      commentModel.countDocuments({ postId }),
    ])

    return {
      items: items.map(this._mapToCommentViewModel),
      totalCount,
      pageSize,
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
    }
  }

  _mapToCommentViewModel(comment: WithId<CommentDB>): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt.toISOString(),
    }
  }
}
