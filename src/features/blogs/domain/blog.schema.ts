import mongoose, { HydratedDocument, InferSchemaType, Model } from 'mongoose'
import { BlogInputModel } from '../types/input/BlogInputModel.js'

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

class BlogEntity {
  private constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    isMembership: boolean,
    createdAt: Date
  ) {}

  static createBlog(dto: BlogInputModel): BlogDocument {
    const blog = new BlogModel(dto)

    return blog
  }

  update(dto: BlogInputModel) {
    this.name = dto.name
    this.description = dto.description
    this.websiteUrl = dto.websiteUrl
  }
}

interface BlogMethods {
  update(dto: BlogInputModel): void
}

export type BlogDB = InferSchemaType<typeof blogSchema>
export type BlogDocument = HydratedDocument<BlogDB, BlogMethods>
export type BlogModelType = Model<BlogDB, {}, BlogMethods> & typeof BlogEntity

blogSchema.loadClass(BlogEntity)

export const BlogModel = mongoose.model<BlogDB, BlogModelType>(
  'Blog',
  blogSchema
)

export enum BlogErrorCode {
  HasPosts = 'BLOG_HAS_POSTS',
}
