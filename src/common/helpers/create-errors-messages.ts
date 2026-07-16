import type { AppError } from '../../core/types/utils-types.js'

export const createErrorsMessages = (
  errors: AppError[]
): {
  errorsMessages: AppError[]
} => {
  return {
    errorsMessages: errors,
  }
}
