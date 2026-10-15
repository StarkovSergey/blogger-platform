import mongoose, { HydratedDocument, InferSchemaType, Model } from 'mongoose'
import { ReactionStatus } from '../constants/enums.js'

export const commentLikeSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.values(ReactionStatus),
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    commentId: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'comment_likes',
  }
)

class CommentLikeEntity {
  status!: ReactionStatus
  userId!: string
  commentId!: string

  static createLike(dto: {
    status: ReactionStatus
    userId: string
    commentId: string
  }): CommentLikeDocument {
    return new CommentLikeModel({
      status: dto.status,
      userId: dto.userId,
      commentId: dto.commentId,
    })
  }

  changeStatus(status: ReactionStatus) {
    this.status = status
  }
}

interface CommentLikeMethods {
  changeStatus(status: ReactionStatus): void
}

export type CommentLikeDB = InferSchemaType<typeof commentLikeSchema>
export type CommentLikeDocument = HydratedDocument<
  CommentLikeDB,
  CommentLikeMethods
>
export type CommentLikeModelType = Model<CommentLikeDB, {}, CommentLikeMethods> &
  typeof CommentLikeEntity

commentLikeSchema.loadClass(CommentLikeEntity)

export const CommentLikeModel = mongoose.model<
  CommentLikeDB,
  CommentLikeModelType
>('CommentLike', commentLikeSchema)
