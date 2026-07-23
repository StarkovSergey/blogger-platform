import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'
import { clearDb } from '../../utils/clear-db.js'
import { PATHS } from '../../../src/core/paths/paths.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { generateAdminAuthToken } from '../../utils/generate-admin-auth-token.js'
import {
  createValidUserInput,
  usersTestClient,
  VALID_USER_INPUT,
} from '../../utils/test-clients/users-test-client.js'
import { runDB, stopDb } from '../../../src/db/mongo.db.js'
import { SETTINGS } from '../../../src/settings/config.js'

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

  it('should create user; POST /api/users', async () => {
    const createdUser = await usersTestClient.createUser(app)

    expect(createdUser).toEqual({
      id: expect.any(String),
      login: VALID_USER_INPUT.login,
      email: VALID_USER_INPUT.email,
      createdAt: expect.any(String),
    })
    expect(createdUser).not.toHaveProperty('password')
    expect(createdUser).not.toHaveProperty('passwordHash')
    expect(Number.isNaN(Date.parse(createdUser.createdAt))).toBe(false)
  })

  it('should not create user without auth; POST /api/users', async () => {
    await request(app)
      .post(PATHS.users)
      .send(VALID_USER_INPUT)
      .expect(HttpStatus.UNAUTHORIZED_401)
  })

  it('should return 400 if login already exists', async () => {
    await usersTestClient.createUser(app)

    const res = await request(app)
      .post(PATHS.users)
      .set('Authorization', generateAdminAuthToken())
      .send(
        createValidUserInput({
          email: 'another@example.com',
        })
      )
      .expect(HttpStatus.BAD_REQUEST_400)

    expect(res.body.errorsMessages).toEqual([
      {
        message: expect.any(String),
        field: 'login',
      },
    ])
  })

  it('should return 400 if email already exists', async () => {
    await usersTestClient.createUser(app)

    const res = await request(app)
      .post(PATHS.users)
      .set('Authorization', generateAdminAuthToken())
      .send(
        createValidUserInput({
          login: 'user_2',
        })
      )
      .expect(HttpStatus.BAD_REQUEST_400)

    expect(res.body.errorsMessages).toEqual([
      {
        message: expect.any(String),
        field: 'email',
      },
    ])
  })

  it('should delete user; DELETE /api/users/:id', async () => {
    const createdUser = await usersTestClient.createUser(app)

    await usersTestClient.deleteUser(app, createdUser.id)

    const users = await usersTestClient.getUsers(app)
    expect(users.items).toHaveLength(0)
    expect(users.totalCount).toBe(0)
  })

  it('should not delete user without auth; DELETE /api/users/:id', async () => {
    const createdUser = await usersTestClient.createUser(app)

    await request(app)
      .delete(`${PATHS.users}/${createdUser.id}`)
      .expect(HttpStatus.UNAUTHORIZED_401)
  })

  it('should return 404 if user does not exist; DELETE /api/users/:id', async () => {
    await request(app)
      .delete(`${PATHS.users}/507f1f77bcf86cd799439011`)
      .set('Authorization', generateAdminAuthToken())
      .expect(HttpStatus.NOT_FOUND_404)
  })
})
