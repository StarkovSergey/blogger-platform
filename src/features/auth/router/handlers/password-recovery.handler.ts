import {
  ApiResponse,
  RequestWithBody,
} from '../../../../core/types/utils-types.js'
import { PasswordRecoveryInputModel } from '../../types/input/password-recovery-input-model.js'
import { authService } from '../../../../composition-root.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'
import { HttpStatus } from '../../../../common/constants/constants.js'

export async function passwordRecoveryHandler(
  req: RequestWithBody<PasswordRecoveryInputModel>,
  res: ApiResponse<void>
) {
  try {
    const result = await authService.passwordRecovery(req.body.email)

    if (result.status !== ResultStatus.Success) {
      return res.status(resultStatusToHttpStatusCode(result.status)).send({
        errorsMessages: result.extensions,
      })
    }

    return res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch (e) {
    console.log(e)
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
