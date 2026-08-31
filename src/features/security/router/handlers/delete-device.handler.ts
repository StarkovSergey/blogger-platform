import {
  ApiResponse,
  RequestWithParams,
} from '../../../../core/types/utils-types.js'
import { securityService } from '../../services/security.service.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'
import { HttpStatus } from '../../../../common/constants/constants.js'

export async function deleteDeviceSessionHandler(
  req: RequestWithParams<{ deviceId: string }>,
  res: ApiResponse<void>
) {
  try {
    const refreshPayload = req.refreshPayload

    if (!refreshPayload) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
    }

    const deviceId = req.params.deviceId
    const result = await securityService.deleteSession(
      deviceId,
      refreshPayload.userId,
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
