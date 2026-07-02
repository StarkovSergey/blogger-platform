import request from 'supertest'
import { beforeAll, describe, it } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'
import { clearDb } from '../../utils/clear-db.js'
import type { BlogInputModel } from '../../../src/features/blogs/models/BlogInputModel.js'
import { PATHS } from '../../../src/core/paths/paths.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { generateAdminAuthToken } from '../../utils/generate-admin-auth-token.js'

describe('Blogs API', () => {
  const app = express()
  setupApp(app)

  beforeAll(async () => {
    await clearDb(app)
  })

  it('should create blog; POST /api/blogs', async () => {
    const newBlog: BlogInputModel = {
      name: 'Inis blog',
      websiteUrl: 'https://inis.com',
      description: 'Отчёты по партиям в Иниш',
    }

    await request(app)
      .post(PATHS.blogs)
      .set('Authorization', generateAdminAuthToken())
      .send(newBlog)
      .expect(HttpStatus.CREATED_201)
  })
})
