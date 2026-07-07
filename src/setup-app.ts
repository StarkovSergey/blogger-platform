import express, { Express } from 'express'
import { blogsRouter } from './features/blogs/router/blogs.router.js'
import { PATHS } from './core/paths/paths.js'
import { testsRouter } from './features/tests/tests.router.js'
import { postsRouter } from './features/posts/router/posts.router.js'

export const setupApp = (app: Express) => {
  app.use(express.json())

  app.get('/', (req, res) => {
    res.status(200).send('Hello world')
  })

  app.use(PATHS.blogs, blogsRouter)
  app.use(PATHS.posts, postsRouter)
  app.use(PATHS.testing, testsRouter)

  return app
}
