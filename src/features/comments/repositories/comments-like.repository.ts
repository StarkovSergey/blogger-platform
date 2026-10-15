import { injectable } from 'inversify'
import {
  CommentLikeDocument,
  CommentLikeModel,
} from '../domain/comment-like.schema.js'

@injectable()
export class CommentsLikeRepository {
  async save(commentLike: CommentLikeDocument) {
    return commentLike.save()
  }

  async findByUserIdAndCommentId(
    userId: string,
    commentId: string
  ): Promise<CommentLikeDocument | null> {
    return CommentLikeModel.findOne({ userId, commentId })
  }

  async delete(id: string) {
    return CommentLikeModel.findByIdAndDelete(id)
  }
}
