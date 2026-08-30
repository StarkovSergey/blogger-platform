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
import { REFRESH_TOKEN_COOKIE_KEY } from '../../utils/constants.js'
import { SETTINGS } from '../../../../settings/config.js'

export async function loginHandler(
  req: RequestWithBody<LoginInputModel>,
  res: ApiResponse<LoginSuccessViewModel>
) {
  try {
    const result = await authService.login(req.body, {
      ip: req.ip ?? 'unknown',
      deviceName: req.headers['user-agent'] ?? 'unknown',
    })

    if (result.status !== ResultStatus.Success) {
      return res.status(resultStatusToHttpStatusCode(result.status)).send({
        errorsMessages: result.extensions,
      })
    }

    res.cookie(REFRESH_TOKEN_COOKIE_KEY, result.data.refreshToken, {
      maxAge: Number(SETTINGS.JWT_REFRESH_TOKEN_EXP_TIME_SECONDS) * 1000,
      httpOnly: true,
      secure: true,
    })

    res.status(HttpStatus.OK_200).json({ accessToken: result.data.accessToken })
  } catch (e) {
    console.log(e)
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
