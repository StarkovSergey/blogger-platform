import { body } from 'express-validator'
import { EMAIL_REGEXP } from '../../../common/constants/regexp.js'

export const createEmailValidationChain = () => [
  body('email')
    .isString()
    .withMessage('email should be a string')
    .trim()
    /** example: example@example.dev */
    .matches(EMAIL_REGEXP)
    .withMessage('incorrect email; example: example@example.dev'),
]
