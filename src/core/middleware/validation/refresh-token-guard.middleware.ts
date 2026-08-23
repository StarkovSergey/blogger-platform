import { NextFunction, Request, Response } from 'express'
import { jwtService } from '../../adapters/jwt.service.js'
import { HttpStatus } from '../../../common/constants/constants.js'
import { REFRESH_TOKEN_COOKIE_KEY } from '../../../features/auth/utils/constants.js'
import { refreshBlackListService } from '../../../features/auth/services/refresh-black-list.service.js'

export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_KEY]

  if (typeof refreshToken !== 'string') {
    return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
  }

  const payload = await jwtService.verifyToken(refreshToken, 'refresh')

  if (!payload) {
    return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
  }

  const isInBlackList =
    await refreshBlackListService.isInBlackList(refreshToken)

  if (isInBlackList) {
    return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
  }

  const { userId } = payload

  req.user = { id: userId }
  next()
}
