import { BlogViewModel } from '../models/BlogViewModel.js'
import { db } from '../../../db/db.js'

export const blogsRepository = {
  findAll(): BlogViewModel[] {
    return db.blogs
  },
  findById(id: string): BlogViewModel | null {
    return db.blogs.find((blog) => blog.id === id) || null
  },
}
