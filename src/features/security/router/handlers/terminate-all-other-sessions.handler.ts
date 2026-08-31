import { Request, Response } from 'express'
import { securityService } from '../../services/security.service.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'

export async function terminateAllOtherSessionsHandler(
  req: Request,
  res: Response
) {
  try {
    const refreshPayload = req.refreshPayload

    if (!refreshPayload) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
    }

    const { userId, deviceId } = refreshPayload

    const result = await securityService.deleteAllOtherSessions(
      deviceId,
      userId,
      refreshPayload.iat
    )

    if (result.status !== ResultStatus.Success) {
      return res
        .status(resultStatusToHttpStatusCode(result.status))
        .json({ errorsMessages: result.extensions })
    }

    res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch (e) {
    return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
