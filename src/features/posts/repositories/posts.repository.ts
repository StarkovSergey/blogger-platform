import { db } from '../../../db/db.js'
import { PostViewModel } from '../models/PostViewModel.js'
import { PostInputModel } from '../models/PostInputModel.js'

export const postsRepository = {
  findAll(): PostViewModel[] {
    return db.posts
  },
  findById(id: string): PostViewModel | null {
    return db.posts.find((post) => post.id === id) || null
  },
  create(post: PostInputModel): PostViewModel | null {
    const blog = db.blogs.find((blog) => blog.id === post.blogId)

    if (!blog) {
      return null
    }

    const newPost = {
      id: String(db.posts.length ? db.posts.length + 1 : 1),
      ...post,
      blogName: blog.name,
    }

    db.posts.push(newPost)
    return newPost
  },
  delete(id: string): boolean {
    const index = db.posts.findIndex((post) => post.id === id)

    if (index === -1) {
      return false
    }

    db.posts.splice(index, 1)
    return true
  },
  update(id: string, dto: PostInputModel): boolean {
    const post = db.posts.find((post) => post.id === id)

    if (!post) {
      return false
    }

    post.title = dto.title
    post.shortDescription = dto.shortDescription
    post.content = dto.content
    post.blogId = dto.blogId

    return true
  },
}
