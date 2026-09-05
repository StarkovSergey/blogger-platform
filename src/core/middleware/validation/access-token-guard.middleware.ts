import { NextFunction, Request, Response } from 'express'
import { HttpStatus } from '../../../common/constants/constants.js'
import { jwtService } from '../../../composition-root.js'

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
  }

  const [authType, token] = req.headers.authorization.split(' ')

  if (authType !== 'Bearer') {
    return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
  }

  const payload = await jwtService.verifyAccessToken(token)

  if (payload) {
    const { userId } = payload

    req.user = { id: userId }
    next()

    return
  }

  res.sendStatus(HttpStatus.UNAUTHORIZED_401)
}
