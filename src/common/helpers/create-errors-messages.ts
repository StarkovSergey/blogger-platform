import type { ValidationError } from '../types/utils-types.js'

export const createErrorsMessages = (
  errors: ValidationError[]
): {
  errorsMessages: ValidationError[]
} => {
  return {
    errorsMessages: errors,
  }
}
