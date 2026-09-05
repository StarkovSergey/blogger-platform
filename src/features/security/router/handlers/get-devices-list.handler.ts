import { Request } from 'express'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'
import { ApiResponse } from '../../../../core/types/utils-types.js'
import { DeviceViewModel } from '../../types/output/DeviceViewModel.js'
import { securityService } from '../../../../composition-root.js'

export async function getDevicesListHandler(
  req: Request,
  res: ApiResponse<DeviceViewModel[]>
) {
  try {
    const refreshPayload = req.refreshPayload

    if (!refreshPayload) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
    }

    const result = await securityService.getAllActiveSessions(refreshPayload)

    if (result.status !== ResultStatus.Success) {
      return res.status(resultStatusToHttpStatusCode(result.status)).send({
        errorsMessages: result.extensions,
      })
    }

    return res.status(HttpStatus.OK_200).json(result.data)
  } catch (e) {
    return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
