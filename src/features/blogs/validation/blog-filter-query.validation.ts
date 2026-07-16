import { query } from 'express-validator'

export const createBlogFilterQueryValidation = () => [
  query('searchNameTerm').optional().isString().trim().isLength({ max: 100 }),
]
