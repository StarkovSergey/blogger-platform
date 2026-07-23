import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'
import { runDB, stopDb } from '../../../src/db/mongo.db.js'
import { SETTINGS } from '../../../src/settings/config.js'
import { clearDb } from '../../utils/clear-db.js'
import {
  usersTestClient,
  VALID_USER_INPUT,
} from '../../utils/test-clients/users-test-client.js'
import request from 'supertest'
import { PATHS } from '../../../src/core/paths/paths.js'
import { LoginInputModel } from '../../../src/features/auth/types/input/login-input-model.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { AUTH_ROUTER_PATHS } from '../../../src/features/auth/router/auth.router.js'

describe('Users API', () => {
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

  it('POST -> "/auth/login": should sign in user; status 204;', async () => {
    await usersTestClient.createUser(app, VALID_USER_INPUT)

    const credentials: LoginInputModel = {
      loginOrEmail: VALID_USER_INPUT.login,
      password: VALID_USER_INPUT.password,
    }
    await request(app)
      .post(`${PATHS.auth}${AUTH_ROUTER_PATHS.LOGIN}`)
      .send(credentials)
      .expect(HttpStatus.NO_CONTENT_204)
  })

  it('POST -> "/auth/login": should return error if passed wrong password; status 401', async () => {
    await usersTestClient.createUser(app, VALID_USER_INPUT)

    const credentials: LoginInputModel = {
      loginOrEmail: VALID_USER_INPUT.login,
      password: 'wrong_password',
    }
    await request(app)
      .post(`${PATHS.auth}${AUTH_ROUTER_PATHS.LOGIN}`)
      .send(credentials)
      .expect(HttpStatus.UNAUTHORIZED_401)
  })
})
