import mongoose, { HydratedDocument, InferSchemaType, Model } from 'mongoose'
import { ReactionStatus } from '../constants/enums.js'

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

class CommentEntity {
  content!: string
  commentatorInfo!: {
    userId: string
    userLogin: string
  }
  createdAt!: Date
  postId!: string
  likesInfo!: {
    likesCount: number
    dislikesCount: number
  }

  static createComment(dto: {
    content: string
    postId: string
    userId: string
    userLogin: string
  }): CommentDocument {
    return new CommentModel({
      content: dto.content,
      postId: dto.postId,
      commentatorInfo: {
        userId: dto.userId,
        userLogin: dto.userLogin,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    })
  }

  updateContent(content: string) {
    this.content = content
  }

  belongsToUser(userId: string) {
    return this.commentatorInfo.userId === userId
  }

  applyLikeChange(prev: ReactionStatus, next: ReactionStatus) {
    if (prev === next) return

    if (prev === ReactionStatus.Like) {
      this.likesInfo.likesCount--
    }
    if (prev === ReactionStatus.Dislike) {
      this.likesInfo.dislikesCount--
    }

    if (next === ReactionStatus.Like) {
      this.likesInfo.likesCount++
    }
    if (next === ReactionStatus.Dislike) {
      this.likesInfo.dislikesCount++
    }
  }
}

interface CommentMethods {
  updateContent(content: string): void
  belongsToUser(userId: string): boolean
  applyLikeChange(prev: ReactionStatus, next: ReactionStatus): void
}

export type CommentDB = InferSchemaType<typeof commentSchema>
export type CommentDocument = HydratedDocument<CommentDB, CommentMethods>
export type CommentModelType = Model<CommentDB, {}, CommentMethods> &
  typeof CommentEntity

commentSchema.loadClass(CommentEntity)

export const CommentModel = mongoose.model<CommentDB, CommentModelType>(
  'Comment',
  commentSchema
)
