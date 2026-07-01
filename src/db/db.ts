import { BlogViewModel } from '../features/blogs/models/BlogViewModel.js'
import { PostViewModel } from '../features/posts/models/PostViewModel.js'

export const db: DB = {
  blogs: [
    {
      id: '1',
      name: 'Inis',
      description: 'О настольной игре Иниш',
      websiteUrl: 'https://inis.com',
    },
  ],
  posts: [],
}

export type DB = {
  blogs: BlogViewModel[]
  posts: PostViewModel[]
}
