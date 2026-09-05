import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'
import { runDB, stopDb } from '../../../src/db/mongo.db.js'
import { SETTINGS } from '../../../src/settings/config.js'
import { clearDb } from '../../utils/clear-db.js'
import request from 'supertest'
import { PATHS } from '../../../src/core/paths/paths.js'
import { AUTH_ROUTER_PATHS } from '../../../src/features/auth/router/auth.router.js'
import { authTestClient } from '../../utils/test-clients/auth-test-client.js'
import { usersRepository } from '../../../src/composition-root.js'

describe('Registration API', () => {
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

  it('should return 400 if email is not valid', async () => {
    const response = await request(app)
      .post(`${PATHS.auth}${AUTH_ROUTER_PATHS.REGISTRATION}`)
      .send({
        email: 'invalid-email',
      })
    expect(response.status).toBe(400)
  })

  it('auth/registration: should return 400 if email already exists', async () => {
    const userDto = {
      email: 'test@test.com',
      login: 'test',
      password: '1234567890',
    }

    await authTestClient.registration(app, userDto)

    const response = await request(app)
      .post(`${PATHS.auth}${AUTH_ROUTER_PATHS.REGISTRATION}`)
      .send({
        email: userDto.email,
        login: 'new-test',
        password: '1234567890',
      })
    expect(response.status).toBe(400)
  })

  it('registration should create user', async () => {
    const userDto = {
      login: 'test',
      email: 'starkovsr@gmail.com',
      password: '1234567890',
    }

    const response = await authTestClient.registration(app, userDto)

    expect(response.status).toBe(204)

    const user = await usersRepository.findByEmail(userDto.email)

    expect(user).toBeDefined()
    expect(user).toMatchObject({
      login: userDto.login,
      email: userDto.email,
      emailConfirmation: {
        isConfirmed: false,
      },
    })
  })
})
