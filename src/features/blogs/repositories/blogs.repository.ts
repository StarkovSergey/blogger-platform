import type { BlogViewModel } from '../models/BlogViewModel.js'
import { db } from '../../../db/db.js'
import type { BlogInputModel } from '../models/BlogInputModel.js'

export const blogsRepository = {
  findAll(): BlogViewModel[] {
    return db.blogs
  },
  findById(id: string): BlogViewModel | null {
    return db.blogs.find((blog) => blog.id === id) || null
  },
  create(blog: BlogInputModel): BlogViewModel {
    const newBlog = {
      id: String(db.blogs.length ? db.blogs.length + 1 : 1),
      ...blog,
    }

    db.blogs.push(newBlog)
    return newBlog
  },
  delete(id: string): boolean {
    const index = db.blogs.findIndex((blog) => blog.id === id)

    if (index === -1) {
      return false
    }

    db.blogs.splice(index, 1)
    return true
  },
  update(id: string, dto: BlogInputModel): boolean {
    const blog = db.blogs.find((blog) => blog.id === id)

    if (!blog) {
      return false
    }

    blog.name = dto.name
    blog.description = dto.description
    blog.websiteUrl = dto.websiteUrl

    return true
  },
}
