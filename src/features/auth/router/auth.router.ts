import { Router } from 'express'
import { createLoginInputModelValidation } from '../validation/login.input-model.validation.js'
import { inputValidationResultMiddleware } from '../../../core/middleware/validation/input-validation-result.middleware.js'
import { loginHandler } from './handlers/login-handler.js'
import { accessTokenGuard } from '../../../core/middleware/validation/access-token-guard.middleware.js'
import { meHandler } from './handlers/me-handler.js'

export const AUTH_ROUTER_PATHS = {
  ROOT: '',
  LOGIN: '/login',
  ME: '/me',
} as const

export const authRouter = Router()

authRouter.post(
  AUTH_ROUTER_PATHS.LOGIN,
  createLoginInputModelValidation(),
  inputValidationResultMiddleware,
  loginHandler
)

authRouter.get(AUTH_ROUTER_PATHS.ME, accessTokenGuard, meHandler)
