import { injectable } from 'inversify'
import {
  CommentLikeDB,
  CommentLikeDocument,
  commentLikeModel,
} from '../domain/comment-like.schema.js'

@injectable()
export class CommentsLikeRepository {
  async save(commentLike: CommentLikeDocument) {
    return commentLike.save()
  }
  async findByUserIdAndCommentId(userId: string, commentId: string) {
    return commentLikeModel.findOne({ userId, commentId })
  }

  async create(commentLike: CommentLikeDB) {
    const result = await commentLikeModel.create(commentLike)

    return result._id.toString()
  }

  async delete(id: string) {
    return commentLikeModel.findByIdAndDelete(id)
  }
}
