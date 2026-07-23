import { body } from 'express-validator'
import { passwordValidation } from '../../users/validation/user.input-model.validation.js'

export const createLoginInputModelValidation = () => [
  passwordValidation,
  body('loginOrEmail')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('loginOrEmail is incorrect'),
]
