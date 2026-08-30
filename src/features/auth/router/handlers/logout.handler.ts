import { Request, Response } from 'express'
import { REFRESH_TOKEN_COOKIE_KEY } from '../../utils/constants.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { authService } from '../../services/auth.service.js'

export async function logoutHandler(req: Request, res: Response) {
  try {
    const refreshTokenPayload = req.refreshPayload
    if (!refreshTokenPayload) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
    }
    const result = await authService.logout(refreshTokenPayload)

    if (result.status !== ResultStatus.Success) {
      return res.status(resultStatusToHttpStatusCode(result.status)).send({
        errorsMessages: result.extensions,
      })
    }

    res.clearCookie(REFRESH_TOKEN_COOKIE_KEY)
    return res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch (e) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
    console.error(e)
  }
}
