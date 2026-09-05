import { Request } from 'express'
import { ApiResponse } from '../../../../core/types/utils-types.js'
import { LoginSuccessViewModel } from '../../types/output/LoginSuccessViewModel.js'
import { REFRESH_TOKEN_COOKIE_KEY } from '../../utils/constants.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { SETTINGS } from '../../../../settings/config.js'
import { authService } from '../../../../composition-root.js'

export const refreshTokenHandler = async (
  req: Request,
  res: ApiResponse<LoginSuccessViewModel>
) => {
  try {
    const refreshPayload = req.refreshPayload

    if (!refreshPayload) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
    }

    const ip = req.ip ?? 'unknown'

    const result = await authService.createNewTokensAndUpdateSession(
      refreshPayload,
      ip
    )

    if (result.status !== ResultStatus.Success) {
      return res
        .status(resultStatusToHttpStatusCode(result.status))
        .json({ errorsMessages: result.extensions })
    }

    const { newRefreshToken, accessToken } = result.data

    res.cookie(REFRESH_TOKEN_COOKIE_KEY, newRefreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: Number(SETTINGS.JWT_REFRESH_TOKEN_EXP_TIME_SECONDS) * 1000,
    })

    return res.status(HttpStatus.OK_200).json({ accessToken })
  } catch (e) {
    console.log(e)
    return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
