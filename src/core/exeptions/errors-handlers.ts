import { Response } from 'express'
import { NotFoundException } from './not-found.exception.js'
import { HttpStatus } from '../../common/constants/constants.js'

export function errorsHandlers(error: unknown, res: Response) {
  if (error instanceof NotFoundException) {
    res.status(HttpStatus.NOT_FOUND_404).send(error.message)

    return
  }

  res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).send('Internal server error')
}
