import {
  ApiResponse,
  RequestWithBody,
} from '../../../../core/types/utils-types.js'
import { authService } from '../../services/auth.service.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { RegistrationConfirmationCodeModel } from '../../types/input/registration-confirmation-code-model.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'

export async function registrationConfirmationHandler(
  req: RequestWithBody<RegistrationConfirmationCodeModel>,
  res: ApiResponse<void>
) {
  try {
    const { code } = req.body

    const result = await authService.confirmEmail(code)

    if (result.status !== ResultStatus.Success) {
      return res.status(resultStatusToHttpStatusCode(result.status)).json({
        errorsMessages: result.extensions,
      })
    }

    return res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch (e) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
    console.error(e)
  }
}
