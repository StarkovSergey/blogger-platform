import { param } from 'express-validator'

export const paramsIdValidationMiddleware = param('id')
  .matches(/^[a-zA-Z0-9_-]+$/)
  .withMessage('ID has invalid format')
