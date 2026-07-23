import { Response } from 'express'
import { NotFoundException } from './not-found.exception.js'
import { HttpStatus } from '../../common/constants/constants.js'
import { createErrorsMessages } from '../../common/helpers/create-errors-messages.js'
import { DomainException } from './domain.exception.js'
import { UnauthorizedException } from './unauthorized.exception.js'

export function errorsHandlers(error: unknown, res: Response) {
  if (error instanceof UnauthorizedException) {
    res.sendStatus(HttpStatus.UNAUTHORIZED_401)

    return
  }

  if (error instanceof NotFoundException) {
    res
      .status(HttpStatus.NOT_FOUND_404)
      .send(createErrorsMessages([{ message: error.message }]))

    return
  }

  if (error instanceof DomainException) {
    // бизнес-ошибка с привязкой к полю → как validation 400
    if (error.source) {
      res.status(HttpStatus.BAD_REQUEST_400).json(
        createErrorsMessages([
          {
            message: error.message,
            field: error.source,
          },
        ])
      )

      return
    }

    // остальные domain (типа HasPosts) → 409
    res.status(HttpStatus.CONFLICT_409).send(
      createErrorsMessages([
        {
          code: error.code,
          message: error.message,
        },
      ])
    )

    return
  }

  res.status(HttpStatus.INTERNAL_SERVER_ERROR_500).send('Internal server error')
}
