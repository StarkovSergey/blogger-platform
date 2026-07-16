import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'
import { clearDb } from '../../utils/clear-db.js'
import { PATHS } from '../../../src/core/paths/paths.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { generateAdminAuthToken } from '../../utils/generate-admin-auth-token.js'
import {
  blogsTestClient,
  createValidBlogPostInput,
} from '../../utils/test-clients/blogs-test-client.js'
import {
  createValidPostInput,
  postsTestClient,
} from '../../utils/test-clients/posts-test-client.js'
import { runDB, stopDb } from '../../../src/db/mongo.db.js'
import { SETTINGS } from '../../../src/settings/config.js'

describe('Blog Posts API', () => {
  const app = express()
  setupApp(app)
  const adminToken = generateAdminAuthToken()

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL_TEST)
  })

  beforeEach(async () => {
    await clearDb(app)
  })

  afterAll(async () => {
    await stopDb()
  })

  describe('GET /api/blogs/:id/posts', () => {
    it('should return empty array when blog has no posts', async () => {
      const blog = await blogsTestClient.createBlog(app)

      const posts = await blogsTestClient.getBlogPosts(app, blog.id)

      expect(posts.items).toEqual([])
    })

    it('should return posts for specific blog', async () => {
      const blog = await blogsTestClient.createBlog(app)

      const post1 = await blogsTestClient.createBlogPost(
        app,
        blog.id,
        createValidBlogPostInput({ title: 'Post 1' })
      )
      const post2 = await blogsTestClient.createBlogPost(
        app,
        blog.id,
        createValidBlogPostInput({
          title: 'Post 2',
          content: 'Content 2',
          shortDescription: 'description 2',
        })
      )

      const posts = await blogsTestClient.getBlogPosts(app, blog.id)

      expect(posts.items).toHaveLength(2)
      expect(posts.items).toEqual(expect.arrayContaining([post1, post2]))
    })

    it('should return only posts of requested blog', async () => {
      const blog1 = await blogsTestClient.createBlog(app)
      const blog2 = await blogsTestClient.createBlog(app, {
        name: 'Second blog',
        description: 'Second description',
        websiteUrl: 'https://second.com',
      })

      const postInBlog1 = await blogsTestClient.createBlogPost(app, blog1.id)
      await postsTestClient.createPost(
        app,
        createValidPostInput(blog2.id, { title: 'Post in blog 2' })
      )

      const posts = await blogsTestClient.getBlogPosts(app, blog1.id)

      expect(posts.items).toHaveLength(1)
      expect(posts.items[0]).toEqual(postInBlog1)
    })

    it('should return 404 if blog does not exist', async () => {
      await request(app)
        .get(`${PATHS.blogs}/507f1f77bcf86cd799439011/posts`)
        .expect(HttpStatus.NOT_FOUND_404)
    })
  })

  describe('POST /api/blogs/:id/posts', () => {
    it('should create post for blog', async () => {
      const blog = await blogsTestClient.createBlog(app)
      const postInput = createValidBlogPostInput()

      const createdPost = await blogsTestClient.createBlogPost(
        app,
        blog.id,
        postInput
      )

      expect(createdPost).toEqual({
        id: expect.any(String),
        title: postInput.title,
        shortDescription: postInput.shortDescription,
        content: postInput.content,
        blogId: blog.id,
        blogName: blog.name,
        createdAt: expect.any(String),
      })
    })

    it('should return 404 if blog does not exist', async () => {
      await request(app)
        .post(`${PATHS.blogs}/507f1f77bcf86cd799439011/posts`)
        .set('Authorization', adminToken)
        .send(createValidBlogPostInput())
        .expect(HttpStatus.NOT_FOUND_404)
    })

    it('should return 401 without auth token', async () => {
      const blog = await blogsTestClient.createBlog(app)

      await request(app)
        .post(`${PATHS.blogs}/${blog.id}/posts`)
        .send(createValidBlogPostInput())
        .expect(HttpStatus.UNAUTHORIZED_401)
    })
  })
})
