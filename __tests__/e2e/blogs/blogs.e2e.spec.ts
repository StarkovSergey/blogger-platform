import request from 'supertest'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'
import { clearDb } from '../../utils/clear-db.js'
import { PATHS } from '../../../src/core/paths/paths.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { generateAdminAuthToken } from '../../utils/generate-admin-auth-token.js'
import { blogsTestClient } from '../../utils/test-clients/blogs-test-client.js'
import { BlogInputModel } from '../../../src/features/blogs/models/BlogInputModel.js'
import { runDB } from '../../../src/db/mongo.db.js'
import { SETTINGS } from '../../../src/settings/config.js'

describe('Blogs API', () => {
  const app = express()
  setupApp(app)
  const adminToken = generateAdminAuthToken()

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL_TEST)
  })

  beforeEach(async () => {
    await clearDb(app)
  })

  it('should create blog; POST /api/blogs', async () => {
    await blogsTestClient.createBlog(app)
  })

  it('should return blogs list; GET /api/blogs', async () => {
    await blogsTestClient.createBlog(app)
    await blogsTestClient.createBlog(app)

    const response = await request(app)
      .get(PATHS.blogs)
      .expect(HttpStatus.OK_200)

    expect(response.body).toHaveLength(2)
  })

  it('should return blog by id; GET /api/blogs/:id', async () => {
    const createdBlog = await blogsTestClient.createBlog(app)

    const foundBlog = await blogsTestClient.getBlogById(app, createdBlog.id)

    expect(foundBlog).toEqual(createdBlog)
  })

  it('should return 404 if blog does not exist; GET /api/blogs/:id', async () => {
    await request(app)
      .get(`${PATHS.blogs}/not-existing-id`)
      .expect(HttpStatus.NOT_FOUND_404)
  })

  it('should update blog; PUT /api/blogs/:id', async () => {
    const createdBlog = await blogsTestClient.createBlog(app)

    const blogUpdatedData: BlogInputModel = {
      description: 'new description',
      name: 'new name',
      websiteUrl: 'https://new-example.com',
    }

    await blogsTestClient.updateBlog(app, createdBlog.id, blogUpdatedData)

    const blogResponse = await blogsTestClient.getBlogById(app, createdBlog.id)
    expect(blogResponse).toEqual({
      ...blogUpdatedData,
      id: createdBlog.id,
    })
  })

  it('should delete blog; DELETE /api/blogs/:id', async () => {
    const createdBlog = await blogsTestClient.createBlog(app)
    console.log(createdBlog)

    await request(app)
      .delete(`${PATHS.blogs}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NO_CONTENT_204)

    await request(app)
      .get(`${PATHS.blogs}/${createdBlog.id}`)
      .expect(HttpStatus.NOT_FOUND_404)
  })
})
