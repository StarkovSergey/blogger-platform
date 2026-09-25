import mongoose, { HydratedDocument, InferSchemaType, Model } from 'mongoose'

export const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: String,
      required: true,
    },
    blogName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'posts' }
)

export type PostDB = InferSchemaType<typeof postSchema>
export type PostDocument = HydratedDocument<PostDB>

export const postModel: Model<PostDB> = mongoose.model('Post', postSchema)
