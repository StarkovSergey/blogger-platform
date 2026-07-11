import { WithId } from 'mongodb'
import { BlogViewModel } from '../../models/BlogViewModel.js'
import { Blog } from '../../types/blog.js'

export const mapToBlogListViewModel = (blog: WithId<Blog>): BlogViewModel => {
  return {
    id: blog._id.toString(),
    websiteUrl: blog.websiteUrl,
    description: blog.description,
    name: blog.name,
    createdAt: blog.createdAt.toISOString(),
  }
}
