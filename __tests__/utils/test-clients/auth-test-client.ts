import { Express } from 'express'
import request from 'supertest'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { PATHS } from '../../../src/core/paths/paths.js'
import { AUTH_ROUTER_PATHS } from '../../../src/features/auth/router/auth.router.js'
import { UserInputModel } from '../../../src/features/users/types/input/UserInputModel.js'
import { expect, vi } from 'vitest'
import { emailService } from '../../../src/core/adapters/email.service.js'
import { LoginInputModel } from '../../../src/features/auth/types/input/login-input-model.js'

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
  async createNewUserWithFourSession() {},
}
