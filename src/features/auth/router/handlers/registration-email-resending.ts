import {
  ApiResponse,
  RequestWithBody,
} from '../../../../core/types/utils-types.js'
import { authService } from '../../services/auth.service.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'
import { RegistrationEmailResendingModel } from '../../types/input/registration-email-resending-model.js'

export async function registrationEmailResendingHandler(
  req: RequestWithBody<RegistrationEmailResendingModel>,
  res: ApiResponse<void>
) {
  try {
    const { email } = req.body
    const result = await authService.emailResending(email)

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
