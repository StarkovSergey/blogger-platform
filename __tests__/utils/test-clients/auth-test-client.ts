import { Express } from 'express'
import request from 'supertest'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { PATHS } from '../../../src/core/paths/paths.js'
import { AUTH_ROUTER_PATHS } from '../../../src/features/auth/router/auth.router.js'
import { UserInputModel } from '../../../src/features/users/types/input/UserInputModel.js'
import { expect, vi } from 'vitest'
import { LoginInputModel } from '../../../src/features/auth/types/input/login-input-model.js'
import { VALID_USER_INPUT } from './users-test-client.js'
import { REFRESH_TOKEN_COOKIE_KEY } from '../../../src/features/auth/utils/constants.js'
import {
  emailService,
  sessionsRepository,
} from '../../../src/composition-root.js'

export const authTestClient = {
  async registration(app: Express, user: UserInputModel) {
    const sendEmailMock = vi
      .spyOn(emailService, 'sendEmail') // следим за вызовом функции sendEmail
      .mockResolvedValue(undefined) // возвращаем  Promise.resolve(undefined), не трогаем оригинальную функцию

    const response = await request(app)
      .post(`${PATHS.auth}${AUTH_ROUTER_PATHS.REGISTRATION}`)
      .send(user)
      .expect(HttpStatus.NO_CONTENT_204)

    expect(sendEmailMock).toHaveBeenCalled()

    return response
  },
  async login(app: Express, user: LoginInputModel, userAgent?: string) {
    const response = await request(app)
      .post(`${PATHS.auth}${AUTH_ROUTER_PATHS.LOGIN}`)
      .set('User-Agent', userAgent ?? 'test-user-agent')
      .send(user)
      .expect(HttpStatus.OK_200)

    return response
  },
  async createNewUserWithFourSession(app: Express, user: UserInputModel) {
    await this.registration(app, user)

    const credentials: LoginInputModel = {
      loginOrEmail: user.login,
      password: user.password,
    }
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148',
    ]
    const loginResponses = await Promise.all(
      userAgents.map((ua) => authTestClient.login(app, credentials, ua))
    )
    for (const res of loginResponses) {
      expect(res.body.accessToken).toBeDefined()
      expect(res.headers['set-cookie'][0]).toContain(REFRESH_TOKEN_COOKIE_KEY)
    }

    const databaseSessions = await sessionsRepository.findAllSessions()
    expect(databaseSessions.length).toBe(userAgents.length)

    return { loginResponses, userAgents }
  },
}
