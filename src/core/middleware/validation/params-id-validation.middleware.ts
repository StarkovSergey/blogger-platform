import { param } from 'express-validator'

export const paramsIdValidationMiddleware = param('id')
  .exists()
  .withMessage('ID is required')
  .isMongoId()
  .withMessage('Incorrect format on ObjectId')
