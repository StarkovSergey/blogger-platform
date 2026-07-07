import { beforeEach, describe, expect, it } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'
import { generateAdminAuthToken } from '../../utils/generate-admin-auth-token.js'
import { clearDb } from '../../utils/clear-db.js'
import { blogsTestClient } from '../../utils/test-clients/blogs-test-client.js'
import {
  createValidPostInput,
  postsTestClient,
} from '../../utils/test-clients/posts-test-client.js'
import request from 'supertest'
import { PATHS } from '../../../src/core/paths/paths.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { response } from 'express'

describe('Posts API', () => {
  const app = express()
  setupApp(app)
  const adminToken = generateAdminAuthToken()

  let blogId: string

  beforeEach(async () => {
    await clearDb(app)

    const blog = await blogsTestClient.createBlog(app)
    blogId = blog.id
  })

  it('should create post; POST /api/posts', () => {
    const post = createValidPostInput(blogId)
    postsTestClient.createPost(app, post)
  })

  it('should return post list; GET /api/posts', async () => {
    const post1 = createValidPostInput(blogId)
    const post2 = createValidPostInput(blogId, {
      title: 'Some title 2',
      content: 'Content 2',
      shortDescription: 'some description 2',
    })
    await postsTestClient.createPost(app, post1)
    await postsTestClient.createPost(app, post2)

    const response = await request(app)
      .get(PATHS.posts)
      .expect(HttpStatus.OK_200)

    expect(response.body).toHaveLength(2)
  })

  it('should return post by id; GET /api/posts/:id', async () => {
    const post = createValidPostInput(blogId)
    const createdPost = await postsTestClient.createPost(app, post)
    const response = await postsTestClient.getPostById(app, createdPost.id)
    expect(response).toEqual(createdPost)
  })

  it('should update post; PUT /api/posts/:id', async () => {
    const post = createValidPostInput(blogId)
    const createdPost = await postsTestClient.createPost(app, post)

    const postUpdatedData = createValidPostInput(blogId, {
      title: 'Some title 2',
      content: 'Content 2',
      shortDescription: 'some description 2',
    })
    await postsTestClient.updatePost(app, createdPost.id, postUpdatedData)

    const postResponse = await postsTestClient.getPostById(app, createdPost.id)
    expect(postResponse).toEqual({
      ...postUpdatedData,
      id: createdPost.id,
      blogName: createdPost.blogName,
    })
  })
  it('should delete post; DELETE /api/posts/:id', async () => {
    const post = createValidPostInput(blogId)
    const createdPost = await postsTestClient.createPost(app, post)
    await postsTestClient.deletePost(app, createdPost.id)

    await request(app)
      .get(`${PATHS.posts}/${createdPost.id}`)
      .expect(HttpStatus.NOT_FOUND_404)
  })
})
