import { NextFunction, Request, Response } from 'express'
import { HttpStatus } from '../../../common/constants/constants.js'
import {
  RATE_LIMIT_MAX_ATTEMPTS,
  RATE_LIMIT_WINDOW_SECONDS,
} from '../../constants/constants.js'
import { rateLimitModel } from '../../domain/rate-limit.schema.js'

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip ?? 'unknown'
  const url = req.originalUrl

  const tenSecondsAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000)

  const attemptsCount = await rateLimitModel.countDocuments({
    url,
    ip,
    date: {
      $gte: tenSecondsAgo,
    },
  })

  if (attemptsCount >= RATE_LIMIT_MAX_ATTEMPTS) {
    return res.sendStatus(HttpStatus.TOO_MANY_REQUESTS_429)
  }

  await rateLimitModel.create({ date: new Date(), ip, url })

  next()
}
