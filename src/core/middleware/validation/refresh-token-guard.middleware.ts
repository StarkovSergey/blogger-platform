import { NextFunction, Request, Response } from 'express'
import { jwtService } from '../../adapters/jwt.service.js'
import { HttpStatus } from '../../../common/constants/constants.js'
import { REFRESH_TOKEN_COOKIE_KEY } from '../../../features/auth/utils/constants.js'
import { authService } from '../../../features/auth/services/auth.service.js'

export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_KEY]

  if (typeof refreshToken !== 'string') {
    return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
  }

  const payload = await jwtService.verifyRefreshToken(refreshToken)

  if (!payload) {
    return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
  }

  const isSessionExist = await authService.isSessionExist(
    payload.iat,
    payload.deviceId
  )

  if (!isSessionExist) {
    return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
  }

  const { userId } = payload

  req.user = { id: userId }
  req.refreshPayload = payload
  next()
}
