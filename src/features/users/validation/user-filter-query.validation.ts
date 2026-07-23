import { query } from 'express-validator'

export const createUserFilterQueryValidation = () => [
  query('searchLoginTerm').optional().isString().trim().isLength({ max: 100 }),
  query('searchEmailTerm').optional().isString().trim().isLength({ max: 50 }),
]
