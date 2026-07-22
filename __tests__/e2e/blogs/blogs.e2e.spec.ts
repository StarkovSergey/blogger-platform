import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'
import { clearDb } from '../../utils/clear-db.js'
import { PATHS } from '../../../src/core/paths/paths.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { generateAdminAuthToken } from '../../utils/generate-admin-auth-token.js'
import { blogsTestClient } from '../../utils/test-clients/blogs-test-client.js'
import { BlogInputModel } from '../../../src/features/blogs/types/input/BlogInputModel.js'
import { runDB, stopDb } from '../../../src/db/mongo.db.js'
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

  afterAll(async () => {
    await stopDb()
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

    expect(response.body.items).toHaveLength(2)
  })

  it('should paginate blogs by pageSize and pageNumber', async () => {
    for (let i = 1; i <= 3; i++) {
      await blogsTestClient.createBlog(app, {
        name: `Blog ${i}`,
        description: 'desc',
        websiteUrl: `https://blog${i}.com`,
      })
    }
    const res = await request(app)
      .get(PATHS.blogs)
      .query({ pageNumber: 2, pageSize: 2 })
      .expect(HttpStatus.OK_200)
    expect(res.body.page).toBe(2)
    expect(res.body.pageSize).toBe(2)
    expect(res.body.totalCount).toBe(3)
    expect(res.body.pagesCount).toBe(2)
    expect(res.body.items).toHaveLength(1)
  })

  it('should filter blogs by searchNameTerm (case-insensitive)', async () => {
    await blogsTestClient.createBlog(app, {
      name: 'React Tips',
      description: 'desc',
      websiteUrl: 'https://react.com',
    })
    await blogsTestClient.createBlog(app, {
      name: 'Node Guide',
      description: 'desc',
      websiteUrl: 'https://node.com',
    })
    const res = await request(app)
      .get(PATHS.blogs)
      .query({ searchNameTerm: 'react' })
      .expect(HttpStatus.OK_200)
    expect(res.body.totalCount).toBe(1)
    expect(res.body.items[0].name).toBe('React Tips')
  })

  it('should treat searchNameTerm as literal text, not regex', async () => {
    await blogsTestClient.createBlog(app, {
      name: 'blog.',
      description: 'desc',
      websiteUrl: 'https://dot.com',
    })
    await blogsTestClient.createBlog(app, {
      name: 'blogX',
      description: 'desc',
      websiteUrl: 'https://x.com',
    })
    const res = await request(app)
      .get(PATHS.blogs)
      .query({ searchNameTerm: 'blog.' })
      .expect(HttpStatus.OK_200)
    // без escape нашлось бы и blogX (`.` = любой символ)
    expect(res.body.totalCount).toBe(1)
    expect(res.body.items[0].name).toBe('blog.')
  })

  it('should sort by name ascending', async () => {
    await blogsTestClient.createBlog(app, {
      name: 'Charlie',
      description: 'desc',
      websiteUrl: 'https://c.com',
    })
    await blogsTestClient.createBlog(app, {
      name: 'Alpha',
      description: 'desc',
      websiteUrl: 'https://a.com',
    })
    const res = await request(app)
      .get(PATHS.blogs)
      .query({ sortBy: 'name', sortDirection: 'asc' })
      .expect(HttpStatus.OK_200)
    expect(res.body.items.map((b: { name: string }) => b.name)).toEqual([
      'Alpha',
      'Charlie',
    ])
  })

  it('should return 400 for invalid pageNumber', async () => {
    await request(app)
      .get(PATHS.blogs)
      .query({ pageNumber: 0 })
      .expect(HttpStatus.BAD_REQUEST_400)
  })

  it('should return blog by id; GET /api/blogs/:id', async () => {
    const createdBlog = await blogsTestClient.createBlog(app)

    const foundBlog = await blogsTestClient.getBlogById(app, createdBlog.id)

    expect(foundBlog).toEqual(createdBlog)
  })

  it('should return 404 if blog does not exist; GET /api/blogs/:id', async () => {
    await request(app)
      .get(`${PATHS.blogs}/507f1f77bcf86cd799439011`)
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
      isMembership: createdBlog.isMembership,
      createdAt: createdBlog.createdAt,
    })
  })

  it('should delete blog; DELETE /api/blogs/:id', async () => {
    const createdBlog = await blogsTestClient.createBlog(app)

    await request(app)
      .delete(`${PATHS.blogs}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NO_CONTENT_204)

    await request(app)
      .get(`${PATHS.blogs}/${createdBlog.id}`)
      .expect(HttpStatus.NOT_FOUND_404)
  })
})
