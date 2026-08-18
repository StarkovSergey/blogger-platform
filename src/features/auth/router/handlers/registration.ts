import {
  ApiResponse,
  RequestWithBody,
} from '../../../../core/types/utils-types.js'
import { RegistrationInputModel } from '../../types/input/registration-input-model.js'
import { authService } from '../../services/auth.service.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'

export async function registrationHandler(
  req: RequestWithBody<RegistrationInputModel>,
  res: ApiResponse<void>
) {
  try {
    const { login, password, email } = req.body

    const result = await authService.registerUser({ email, login, password })

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
