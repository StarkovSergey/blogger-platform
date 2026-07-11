import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'
import { clearDb } from '../../utils/clear-db.js'
import { PATHS } from '../../../src/core/paths/paths.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { generateAdminAuthToken } from '../../utils/generate-admin-auth-token.js'
import { VALID_BLOG_INPUT } from '../../utils/test-clients/blogs-test-client.js'
import { runDB, stopDb } from '../../../src/db/mongo.db.js'
import { SETTINGS } from '../../../src/settings/config.js'

const invalidBlogBodies = [
  {
    title: 'Too long name',
    body: {
      name: 'The best blog ever about cats and dragons',
      description: 'Some description',
      websiteUrl: 'https://example.com',
    },
    expectedErrorsCount: 1,
  },
  {
    title: 'without description',
    body: {
      name: 'The best blog',
      websiteUrl: 'https://example.com',
    },
    expectedErrorsCount: 1,
  },
  {
    title: 'with incorrect site url',
    body: {
      name: 'The best blog',
      description: 'Some description',
      websiteUrl: 'example',
    },
    expectedErrorsCount: 1,
  },
  {
    title: 'empty name after trim',
    body: {
      name: '     ',
      description: 'Some description',
      websiteUrl: 'https://example.com',
    },
    expectedErrorsCount: 1,
  },
  {
    title: 'empty description after trim',
    body: {
      name: 'The best blog',
      description: '     ',
      websiteUrl: 'https://example.com',
    },
    expectedErrorsCount: 1,
  },
  {
    title: 'name is not string',
    body: {
      name: 123,
      description: 'Some description',
      websiteUrl: 'https://example.com',
    },
    expectedErrorsCount: 1,
  },
  {
    title: 'description is not string',
    body: {
      name: 'The best blog',
      description: 123,
      websiteUrl: 'https://example.com',
    },
    expectedErrorsCount: 1,
  },
]

describe('Blogs API body validation check', () => {
  const app = express()
  setupApp(app)

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL_TEST)
  })

  beforeEach(async () => {
    await clearDb(app)
  })

  afterAll(async () => {
    await stopDb()
  })

  it('should not create blog without auth token; POST /api/blogs', async () => {
    await request(app)
      .post(PATHS.blogs)
      .send(VALID_BLOG_INPUT)
      .expect(HttpStatus.UNAUTHORIZED_401)
  })

  it.each(invalidBlogBodies)(
    'should not create blog when $title',
    async ({ body, expectedErrorsCount }) => {
      const res = await request(app)
        .post(PATHS.blogs)
        .set('Authorization', generateAdminAuthToken())
        .send(body)
        .expect(HttpStatus.BAD_REQUEST_400)

      expect(res.body.errorsMessages).toHaveLength(expectedErrorsCount)
    }
  )
})
