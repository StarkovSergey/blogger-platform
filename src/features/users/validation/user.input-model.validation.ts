import { body } from 'express-validator'
import { EMAIL_REGEXP } from '../../../common/constants/regexp.js'

export const passwordValidation = body('password')
  .isString()
  .withMessage('password should be a string')
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('Length of password should be from 6 to 20 characters')

export const createUserInputModelValidationChain = () => [
  body('login')
    .isString()
    .withMessage('login should be a string')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Length of login should be from 3 to 10 characters')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('incorrect characters'),
  passwordValidation,
  body('email')
    .isString()
    .withMessage('email should be a string')
    .trim()
    /** example: example@example.dev */
    .matches(EMAIL_REGEXP)
    .withMessage('incorrect email; example: example@example.dev'),
]
