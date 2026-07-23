import { Router } from 'express'
import { createLoginInputModelValidation } from '../validation/login.input-model.validation.js'
import { inputValidationResultMiddleware } from '../../../core/middleware/validation/input-validation-result.middleware.js'
import { loginHandler } from './handlers/login-handler.js'

export const AUTH_ROUTER_PATHS = {
  ROOT: '',
  LOGIN: '/login',
} as const

export const authRouter = Router()

authRouter.post(
  AUTH_ROUTER_PATHS.LOGIN,
  createLoginInputModelValidation(),
  inputValidationResultMiddleware,
  loginHandler
)
