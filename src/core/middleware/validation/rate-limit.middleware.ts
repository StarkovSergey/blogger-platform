import { NextFunction, Request, Response } from 'express'
import { rateLimitCollection } from '../../../db/collections.js'
import { HttpStatus } from '../../../common/constants/constants.js'
import {
  RATE_LIMIT_MAX_ATTEMPTS,
  RATE_LIMIT_WINDOW_SECONDS,
} from '../../constants/constants.js'

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip ?? 'unknown'
  const url = req.originalUrl

  const tenSecondsAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000)

  const attemptsCount = await rateLimitCollection.countDocuments({
    url,
    ip,
    date: {
      $gte: tenSecondsAgo,
    },
  })

  if (attemptsCount >= RATE_LIMIT_MAX_ATTEMPTS) {
    return res.sendStatus(HttpStatus.TOO_MANY_REQUESTS_429)
  }

  await rateLimitCollection.insertOne({ date: new Date(), ip, url })

  next()
}
