import { body } from 'express-validator'

export const confirmationCodeValidation = body('code')
  .isUUID()
  .withMessage('Incorrect code')
