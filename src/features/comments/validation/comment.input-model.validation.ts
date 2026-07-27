import { body } from 'express-validator'

export const createCommentInputModelValidationChain = () => [
  body('content')
    .isString()
    .withMessage('Content should be string')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('Length of content should be from 20 to 300 characters'),
]
