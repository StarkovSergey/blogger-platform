import request from 'supertest'
import { beforeAll, beforeEach, describe, it } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'
import { clearDb } from '../../utils/clear-db.js'
import type { BlogInputModel } from '../../../src/features/blogs/models/BlogInputModel.js'
import { PATHS } from '../../../src/core/paths/paths.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { generateAdminAuthToken } from '../../utils/generate-admin-auth-token.js'
import { blogsTestClient } from '../../utils/test-clients/blogs-test-client.js'

describe('Blogs API', () => {
  const app = express()
  setupApp(app)

  beforeEach(async () => {
    await clearDb(app)
  })

  it('should create blog; POST /api/blogs', async () => {
    await blogsTestClient.createBlog(app)
  })
})
