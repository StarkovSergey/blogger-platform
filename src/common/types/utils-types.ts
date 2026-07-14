import type { Request, Response } from 'express'

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B, R = any> = Request<T, R, B>

export type ApiResponse<T> = Response<T | ValidationErrorDto>

export type AppError = {
  message: string
  field?: string // валидация
  code?: string // domain
}

export type ValidationErrorDto = {
  errorsMessages: AppError[]
}
