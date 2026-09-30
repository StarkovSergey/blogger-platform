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

export type CommentLikeDB = InferSchemaType<typeof commentLikeSchema>
export type CommentLikeDocument = HydratedDocument<CommentLikeDB>
export const commentLikeModel: Model<CommentLikeDB> = mongoose.model(
  'CommentLike',
  commentLikeSchema
)
