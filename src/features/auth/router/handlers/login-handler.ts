import {
  ApiResponse,
  RequestWithBody,
} from '../../../../core/types/utils-types.js'
import { LoginInputModel } from '../../types/input/login-input-model.js'
import { authService } from '../../services/auth.service.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { LoginSuccessViewModel } from '../../types/output/LoginSuccessViewModel.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'

export async function loginHandler(
  req: RequestWithBody<LoginInputModel>,
  res: ApiResponse<LoginSuccessViewModel>
) {
  try {
    const result = await authService.login(req.body)

    if (result.status !== ResultStatus.Success) {
      return res.status(resultStatusToHttpStatusCode(result.status)).send({
        errorsMessages: result.extensions,
      })
    }

    res.status(HttpStatus.OK_200).json({ accessToken: result.data.accessToken })
  } catch (e) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
