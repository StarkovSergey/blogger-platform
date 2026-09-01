import { afterAll, beforeAll, beforeEach, describe, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'
import { setupApp } from '../../../src/setup-app.js'
import { runDB, stopDb } from '../../../src/db/mongo.db.js'
import { SETTINGS } from '../../../src/settings/config.js'
import { clearDb } from '../../utils/clear-db.js'
import { PATHS } from '../../../src/core/paths/paths.js'
import { AUTH_ROUTER_PATHS } from '../../../src/features/auth/router/auth.router.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import {
  RATE_LIMIT_MAX_ATTEMPTS,
  RATE_LIMIT_WINDOW_SECONDS,
} from '../../../src/core/constants/constants.js'

describe('Rate limit', () => {
  const app = express()
  setupApp(app)

  const loginUrl = `${PATHS.auth}${AUTH_ROUTER_PATHS.LOGIN}`

  const credentials = {
    loginOrEmail: 'nobody',
    password: 'wrong_password',
  }

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL_TEST)
  })

  beforeEach(async () => {
    await clearDb(app)
  })

  afterAll(async () => {
    await stopDb()
  })

  it('should return 429 when attempts exceed limit within window', async () => {
    // первые N запросов — не 429 (даже с 401, middleware стоит раньше handler)
    for (let i = 0; i < RATE_LIMIT_MAX_ATTEMPTS; i++) {
      await request(app)
        .post(loginUrl)
        .send(credentials)
        .expect((res) => {
          expect(res.status).not.toBe(HttpStatus.TOO_MANY_REQUESTS_429)
        })
    }

    // следующий — 429
    await request(app)
      .post(loginUrl)
      .send(credentials)
      .expect(HttpStatus.TOO_MANY_REQUESTS_429)
  })

  it(
    'should allow requests again after rate limit window',
    async () => {
      for (let i = 0; i <= RATE_LIMIT_MAX_ATTEMPTS; i++) {
        await request(app).post(loginUrl).send(credentials)
      }
      await new Promise((r) =>
        setTimeout(r, RATE_LIMIT_WINDOW_SECONDS * 1000 + 200)
      )
      await request(app)
        .post(loginUrl)
        .send(credentials)
        .expect((res) => {
          expect(res.status).not.toBe(HttpStatus.TOO_MANY_REQUESTS_429)
        })
    },
    RATE_LIMIT_WINDOW_SECONDS * 1000 + 5000 // увеличить timeout теста
  )

  it('should count rate limit separately per url', async () => {
    const registrationUrl = `${PATHS.auth}${AUTH_ROUTER_PATHS.REGISTRATION}`
    for (let i = 0; i < RATE_LIMIT_MAX_ATTEMPTS; i++) {
      await request(app).post(loginUrl).send(credentials)
    }
    // login уже исчерпан, но registration — отдельный url
    await request(app)
      .post(registrationUrl)
      .send({ email: 'bad', login: 'x', password: '1234567890' })
      .expect((res) => {
        expect(res.status).not.toBe(HttpStatus.TOO_MANY_REQUESTS_429)
      })
  })
})
