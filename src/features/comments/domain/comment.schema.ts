import mongoose, { HydratedDocument, InferSchemaType, Model } from 'mongoose'

const commentatorInfoSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  { _id: false }
)

const likesInfoSchema = new mongoose.Schema(
  {
    likesCount: {
      type: Number,
      default: 0,
      required: true,
    },
    dislikesCount: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { _id: false }
)

export const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minlength: 1,
      maxlength: 10000,
      required: true,
    },
    commentatorInfo: {
      type: commentatorInfoSchema,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    postId: {
      type: String,
      required: true,
    },
    likesInfo: {
      type: likesInfoSchema,
      required: true,
    },
  },
  {
    collection: 'comments',
  }
)

export type CommentDB = InferSchemaType<typeof commentSchema>
export type CommentDocument = HydratedDocument<CommentDB>
export const commentModel: Model<CommentDB> = mongoose.model(
  'Comment',
  commentSchema
)
