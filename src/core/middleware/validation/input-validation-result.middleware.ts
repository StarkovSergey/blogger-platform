import type { NextFunction, Request, Response } from 'express'
import {
  type FieldValidationError,
  type ValidationError as ExpressValidatorError,
  validationResult,
} from 'express-validator'
import type { ValidationError } from '../../../common/types/utils-types.js'
import { HttpStatus } from '../../../common/constants/constants.js'

const formatErrors = (error: ExpressValidatorError): ValidationError => {
  const expressError = error as FieldValidationError

  return {
    field: expressError.path,
    message: expressError.msg,
  }
}

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true })

  if (errors.length > 0) {
    res.status(HttpStatus.BAD_REQUEST_400).json({ errorsMessages: errors })
    return
  }

  next()
}
