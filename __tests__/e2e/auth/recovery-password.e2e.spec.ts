import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'
import { runDB, stopDb } from '../../../src/db/mongo.db.js'
import { SETTINGS } from '../../../src/settings/config.js'
import { clearDb } from '../../utils/clear-db.js'
import { authTestClient } from '../../utils/test-clients/auth-test-client.js'
import request from 'supertest'
import { PATHS } from '../../../src/core/paths/paths.js'
import { AUTH_ROUTER_PATHS } from '../../../src/features/auth/router/auth.router.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'

describe('Recovery password', () => {
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

  it('POST -> "auth/password-recovery": should send email with recovery code; status 204', async () => {
    const userDto = {
      login: 'test',
      email: 'starkovsr@gmail.com',
      password: '1234567890',
    }

    await authTestClient.registration(app, userDto)

    const response = await request(app)
      .post(`${PATHS.auth}${AUTH_ROUTER_PATHS.PASSWORD_RECOVERY}`)
      .send({ email: userDto.email })
      .expect(HttpStatus.NO_CONTENT_204)
  })

  it('POST -> "auth/new-password": should return error if password is incorrect; status 400;', async () => {})
})
