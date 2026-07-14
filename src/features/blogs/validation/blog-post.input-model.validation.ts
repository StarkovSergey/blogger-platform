import { body } from 'express-validator'

// TODO: подумать как переиспользовать валидацию из posts
export const createBlogPostInputModelValidationChain = () => [
  body('title')
    .isString()
    .withMessage('Title should be string')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Length of title should be from 1 to 30 characters'),
  body('shortDescription')
    .isString()
    .withMessage('shortDescription should be string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      'Length of shortDescription should be from 1 to 100 characters'
    ),
  body('content')
    .isString()
    .withMessage('content should be string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Length of content should be from 1 to 1000 characters'),
]
