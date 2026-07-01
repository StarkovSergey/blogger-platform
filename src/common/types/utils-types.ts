import type { Request, Response } from 'express'

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>

export type ApiResponse<T> = Response<T | ErrorResponse>

export type ValidationError = {
  field: string
  message: string
}

export type ErrorResponse = {
  errorsMessages: ValidationError[]
}
