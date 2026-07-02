import { body } from 'express-validator'

export const createBlogInputModelValidationChain = () => [
  body('name')
    .isString()
    .withMessage('name should be string')
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Length of name should be from 1 to 15 characters'),
  body('description')
    .isString()
    .withMessage('description should be string')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Length of description should be from 1 to 500 characters'),
  body('websiteUrl')
    .isString()
    .withMessage('Website URL should be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Length of websiteUrl should be from 1 to 100 characters')
    .matches(
      /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    )
    .withMessage('Website URL is not valid'),
]
