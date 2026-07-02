import request from 'supertest'
import { Express } from 'express'
import { PATHS } from '../../src/core/paths/paths.js'
import { HttpStatus } from '../../src/common/constants/constants.js'

export const clearDb = async (app: Express) => {
  await request(app)
    .delete(`${PATHS.testing}/all-data`)
    .expect(HttpStatus.NO_CONTENT_204)
}
