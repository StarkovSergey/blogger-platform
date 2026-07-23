import { Express } from 'express'
import request from 'supertest'
import { PATHS } from '../../../src/core/paths/paths.js'
import { generateAdminAuthToken } from '../generate-admin-auth-token.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { UserInputModel } from '../../../src/features/users/types/input/UserInputModel.js'
import { UserViewModel } from '../../../src/features/users/types/output/UserViewModel.js'

export const VALID_USER_INPUT: UserInputModel = {
  login: 'user_1',
  password: 'qwerty1',
  email: 'user1@example.com',
}

export const createValidUserInput = (
  overrides: Partial<UserInputModel> = {}
): UserInputModel => ({
  ...VALID_USER_INPUT,
  ...overrides,
})

export const usersTestClient = {
  async createUser(
    app: Express,
    user: UserInputModel = VALID_USER_INPUT
  ): Promise<UserViewModel> {
    const res = await request(app)
      .post(PATHS.users)
      .set('Authorization', generateAdminAuthToken())
      .send(user)
      .expect(HttpStatus.CREATED_201)

    return res.body
  },
  async deleteUser(app: Express, id: string): Promise<void> {
    await request(app)
      .delete(`${PATHS.users}/${id}`)
      .set('Authorization', generateAdminAuthToken())
      .expect(HttpStatus.NO_CONTENT_204)
  },
  async getUsers(app: Express) {
    const res = await request(app)
      .get(PATHS.users)
      .set('Authorization', generateAdminAuthToken())
      .expect(HttpStatus.OK_200)

    return res.body
  },
}
