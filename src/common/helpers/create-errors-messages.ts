import type { AppError } from '../types/utils-types.js'

export const createErrorsMessages = (
  errors: AppError[]
): {
  errorsMessages: AppError[]
} => {
  return {
    errorsMessages: errors,
  }
}
