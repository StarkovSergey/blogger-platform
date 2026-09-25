import mongoose, { HydratedDocument, InferSchemaType, Model } from 'mongoose'

export const blogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
      required: true,
    },
    isMembership: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'blogs' }
)

export type BlogDB = InferSchemaType<typeof blogSchema>
export type BlogDocument = HydratedDocument<BlogDB>

export const blogModel: Model<BlogDB> = mongoose.model('Blog', blogSchema)

export enum BlogErrorCode {
  HasPosts = 'BLOG_HAS_POSTS',
}
