import { body } from 'express-validator'
import { passwordValidation } from '../../users/validation/user.input-model.validation.js'

export const createNewPasswordValidationChain = () => [
  passwordValidation('newPassword'),
  body('recoveryCode').isUUID().withMessage('Incorrect code'),
]
