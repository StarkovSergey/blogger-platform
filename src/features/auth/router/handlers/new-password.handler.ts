import {
  ApiResponse,
  RequestWithBody,
} from '../../../../core/types/utils-types.js'
import { NewPasswordRecoveryInputModel } from '../../types/input/new-password-recovery-input-model.js'
import { authService } from '../../../../composition-root.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'
import { HttpStatus } from '../../../../common/constants/constants.js'

export async function newPasswordHandler(
  req: RequestWithBody<NewPasswordRecoveryInputModel>,
  res: ApiResponse<void>
) {
  try {
    const result = await authService.updatePassword(req.body)

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
