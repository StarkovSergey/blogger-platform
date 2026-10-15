import mongoose, { HydratedDocument, InferSchemaType, Model } from 'mongoose'
import { PostInputModel } from '../types/input/PostInputModel.js'

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

class PostEntity {
  private constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: Date
  ) {}

  static createPost(dto: {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
  }): PostDocument {
    return new PostModel({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: dto.blogName,
      // createdAt — из default схемы (Date.now)
    })
  }

  update(dto: PostInputModel) {
    this.title = dto.title
    this.shortDescription = dto.shortDescription
    this.content = dto.content
    this.blogId = dto.blogId
  }
}

interface PostMethods {
  update(dto: PostInputModel): void
}

export type PostDB = InferSchemaType<typeof postSchema>
export type PostDocument = HydratedDocument<PostDB, PostMethods>
export type PostModelType = Model<PostDB, {}, PostMethods> & typeof PostEntity

postSchema.loadClass(PostEntity)

export const PostModel = mongoose.model<PostDB, PostModelType>(
  'Post',
  postSchema
)
