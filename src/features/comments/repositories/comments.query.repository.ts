import { WithId } from 'mongodb'
import { CommentViewModel } from '../types/output/CommentViewModel.js'
import { CommentQueryInput } from '../types/input/comment-query-input.js'
import { Pagination } from '../../../core/types/paginated-output.js'
import { injectable } from 'inversify'
import { CommentDB, commentModel } from '../domain/comment.schema.js'
import { ReactionStatus } from '../constants/enums.js'
import { commentLikeModel } from '../domain/comment-like.schema.js'

@injectable()
export class CommentsQueryRepository {
  async findById(
    id: string,
    userId?: string
  ): Promise<CommentViewModel | null> {
    const comment = await commentModel.findById(id).lean()
    return comment ? await this._mapToCommentViewModel(comment, userId) : null
  }

  async findCommentsByPostId(
    postId: string,
    queryDto: CommentQueryInput,
    userId?: string
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
      items: await Promise.all(
        items.map((comment) => this._mapToCommentViewModel(comment, userId))
      ),
      totalCount,
      pageSize,
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
    }
  }

  async _mapToCommentViewModel(
    comment: WithId<CommentDB>,
    userId?: string
  ): Promise<CommentViewModel> {
    let myStatus = ReactionStatus.None

    if (userId) {
      const reaction = await commentLikeModel
        .findOne({
          commentId: comment._id.toString(),
          userId,
        })
        .lean()

      myStatus = reaction?.status ?? ReactionStatus.None
    }

    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt.toISOString(),
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus,
      },
    }
  }
}
