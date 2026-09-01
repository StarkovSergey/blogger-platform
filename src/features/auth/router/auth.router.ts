import { Router } from 'express'
import { createLoginInputModelValidation } from '../validation/login.input-model.validation.js'
import { inputValidationResultMiddleware } from '../../../core/middleware/validation/input-validation-result.middleware.js'
import { loginHandler } from './handlers/login-handler.js'
import { accessTokenGuard } from '../../../core/middleware/validation/access-token-guard.middleware.js'
import { meHandler } from './handlers/me-handler.js'
import { registrationHandler } from './handlers/registration.js'
import { confirmationCodeValidation } from '../validation/confirmation-code.validation.js'
import { registrationConfirmationHandler } from './handlers/registration-confirmation.js'
import { createUserInputModelValidationChain } from '../../users/validation/user.input-model.validation.js'
import { createEmailResendingInputModelValidationChain } from '../validation/email-resending.input-model.validation.js'
import { registrationEmailResendingHandler } from './handlers/registration-email-resending.js'
import { refreshTokenGuard } from '../../../core/middleware/validation/refresh-token-guard.middleware.js'
import { refreshTokenHandler } from './handlers/refresh-token.handler.js'
import { logoutHandler } from './handlers/logout.handler.js'
import { rateLimitMiddleware } from '../../../core/middleware/validation/rate-limit.middleware.js'

export const AUTH_ROUTER_PATHS = {
  ROOT: '',
  LOGIN: '/login',
  ME: '/me',
  REGISTRATION: '/registration',
  REGISTRATION_CONFIRMATION: '/registration-confirmation',
  REGISTRATION_EMAIL_RESENDING: '/registration-email-resending',
  REFRESH_TOKEN: '/refresh-token',
  LOGOUT: '/logout',
} as const

export const authRouter = Router()

authRouter.post(
  AUTH_ROUTER_PATHS.LOGIN,
  rateLimitMiddleware,
  createLoginInputModelValidation(),
  inputValidationResultMiddleware,
  loginHandler
)

authRouter.get(AUTH_ROUTER_PATHS.ME, accessTokenGuard, meHandler)

authRouter.post(
  AUTH_ROUTER_PATHS.REGISTRATION,
  rateLimitMiddleware,
  createUserInputModelValidationChain(),
  inputValidationResultMiddleware,
  registrationHandler
)

authRouter.post(
  AUTH_ROUTER_PATHS.REGISTRATION_CONFIRMATION,
  rateLimitMiddleware,
  confirmationCodeValidation,
  inputValidationResultMiddleware,
  registrationConfirmationHandler
)

authRouter.post(
  AUTH_ROUTER_PATHS.REGISTRATION_EMAIL_RESENDING,
  rateLimitMiddleware,
  createEmailResendingInputModelValidationChain(),
  inputValidationResultMiddleware,
  registrationEmailResendingHandler
)

authRouter.post(
  AUTH_ROUTER_PATHS.REFRESH_TOKEN,
  refreshTokenGuard,
  refreshTokenHandler
)

authRouter.post(AUTH_ROUTER_PATHS.LOGOUT, refreshTokenGuard, logoutHandler)
