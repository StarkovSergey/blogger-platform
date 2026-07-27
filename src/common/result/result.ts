/**
 * Отправляются из слоя сервисов
 */
type SuccessResult<T> = {
  status: ResultStatus.Success
  data: T
  extensions: []
}
type FailureResult = {
  status: Exclude<ResultStatus, ResultStatus.Success>
  errorMessage?: string
  extensions: Extension[]
  data: null
}
export type Result<T = null> = SuccessResult<T> | FailureResult

export enum ResultStatus {
  Success = 'Success',
  NotFound = 'NotFound',
  Forbidden = 'Forbidden',
  Unauthorized = 'Unauthorized',
  BadRequest = 'BadRequest',
}

type Extension = {
  field: string | undefined
  message: string
  code?: string // domain
}
