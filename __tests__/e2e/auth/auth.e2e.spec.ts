import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
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
import { REFRESH_TOKEN_COOKIE_KEY } from '../../../src/features/auth/utils/constants.js'
import { authTestClient } from '../../utils/test-clients/auth-test-client.js'
import { sessionsRepository } from '../../../src/features/auth/repositories/sessions.repository.js'
import { SECURITY_ROUTER_PATHS } from '../../../src/features/security/router/security.router.js'

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
    const response = await request(app)
      .post(`${PATHS.auth}${AUTH_ROUTER_PATHS.LOGIN}`)
      .send(credentials)
      .expect(HttpStatus.OK_200)

    expect(response.body.accessToken).toBeDefined()

    const cookie = response.headers['set-cookie']

    expect(cookie[0]).toContain(REFRESH_TOKEN_COOKIE_KEY)
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

  it('POST -> "auth/logout": should logout user; status 204', async () => {
    await usersTestClient.createUser(app, VALID_USER_INPUT)

    const credentials: LoginInputModel = {
      loginOrEmail: VALID_USER_INPUT.login,
      password: VALID_USER_INPUT.password,
    }

    const loginResponse = await authTestClient.login(app, credentials)

    await request(app)
      .post(`${PATHS.auth}${AUTH_ROUTER_PATHS.LOGOUT}`)
      .set('Cookie', loginResponse.headers['set-cookie'])
      .send(credentials)
      .expect(HttpStatus.NO_CONTENT_204)
  })

  it('should create 4 sessions for the same user with different user-agents', async () => {
    const { loginResponses, userAgents } =
      await authTestClient.createNewUserWithFourSession(app, VALID_USER_INPUT)

    const devices = await request(app)
      .get(`${PATHS.security}${SECURITY_ROUTER_PATHS.DEVICES}`)
      .set('Cookie', loginResponses[0].headers['set-cookie'])

    expect(devices.body.length).toBe(userAgents.length)

    await new Promise((r) => setTimeout(r, 2000))

    // update refresh token for device 1
    const updatedRefreshToken = await request(app)
      .post(`${PATHS.auth}${AUTH_ROUTER_PATHS.REFRESH_TOKEN}`)
      .set('Cookie', loginResponses[0].headers['set-cookie'])
      .expect(HttpStatus.OK_200)

    // Запрашиваем список девайсов с обновленным токеном. Количество девайсов и deviceId  всех девайсов не должны измениться. LastActiveDate девайса 1 должна измениться
    const updatedDevices = await request(app)
      .get(`${PATHS.security}${SECURITY_ROUTER_PATHS.DEVICES}`)
      .set('Cookie', updatedRefreshToken.headers['set-cookie'])

    expect(updatedDevices.body.length).toBe(userAgents.length)
    expect(updatedDevices.body[0].deviceId).toBe(devices.body[0].deviceId)

    const targetTitle = userAgents[0]

    const before = devices.body.find(
      (d: { title: string }) => d.title === targetTitle
    )
    const after = updatedDevices.body.find(
      (d: { title: string }) => d.title === targetTitle
    )

    expect(after.lastActiveDate).not.toBe(before.lastActiveDate)

    // Удаляем девайс 2 (передаем refreshToken девайса 1). Запрашиваем список девайсов. Проверяем, что девайс 2 отсутствует в списке;
    const deviceToDelete = updatedDevices.body.find(
      (d: { title: string }) => d.title === userAgents[1]
    )

    await request(app)
      .delete(
        `${PATHS.security}${SECURITY_ROUTER_PATHS.DEVICES}/${deviceToDelete.deviceId}`
      )
      .set('Cookie', updatedRefreshToken.headers['set-cookie'])
      .expect(HttpStatus.NO_CONTENT_204)

    const devicesAfterDelete = await request(app)
      .get(`${PATHS.security}${SECURITY_ROUTER_PATHS.DEVICES}`)
      .set('Cookie', updatedRefreshToken.headers['set-cookie'])

    expect(devicesAfterDelete.body.length).toBe(userAgents.length - 1)
    expect(
      devicesAfterDelete.body.find(
        (d: { title: string }) => d.title === userAgents[1]
      )
    ).toBeUndefined()
  })

  it('after logout should reduce number of sessions by 1', async () => {
    const { loginResponses, userAgents } =
      await authTestClient.createNewUserWithFourSession(app, VALID_USER_INPUT)

    await request(app)
      .post(`${PATHS.auth}${AUTH_ROUTER_PATHS.LOGOUT}`)
      .set('Cookie', loginResponses[0].headers['set-cookie'])
      .expect(HttpStatus.NO_CONTENT_204)

    const devices = await request(app)
      .get(`${PATHS.security}${SECURITY_ROUTER_PATHS.DEVICES}`)
      .set('Cookie', loginResponses[1].headers['set-cookie'])
      .expect(HttpStatus.OK_200)

    expect(devices.body.length).toBe(userAgents.length - 1)
  })

  it('should remove all other sessions except the current one', async () => {
    const { loginResponses, userAgents } =
      await authTestClient.createNewUserWithFourSession(app, VALID_USER_INPUT)

    await request(app)
      .delete(`${PATHS.security}${SECURITY_ROUTER_PATHS.DEVICES}`)
      .set('Cookie', loginResponses[0].headers['set-cookie'])
      .expect(HttpStatus.NO_CONTENT_204)

    const devices = await request(app)
      .get(`${PATHS.security}${SECURITY_ROUTER_PATHS.DEVICES}`)
      .set('Cookie', loginResponses[0].headers['set-cookie'])
      .expect(HttpStatus.OK_200)

    expect(devices.body.length).toBe(1)
    expect(devices.body[0].title).toBe(userAgents[0])
  })
})
