import { ResultStatus } from './result.js'
import { HttpStatus } from '../constants/constants.js'

/**
 *  Используем в слое роутеров
 */
export const resultStatusToHttpStatusCode = (
  resultCode: ResultStatus
): number => {
  switch (resultCode) {
    case ResultStatus.BadRequest:
      return HttpStatus.BAD_REQUEST_400
    case ResultStatus.Unauthorized:
      return HttpStatus.UNAUTHORIZED_401
    case ResultStatus.Forbidden:
      return HttpStatus.FORBIDDEN_403
    case ResultStatus.NotFound:
      return HttpStatus.NOT_FOUND_404
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR_500
  }
}
