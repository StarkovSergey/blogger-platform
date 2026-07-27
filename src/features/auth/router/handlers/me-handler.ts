import { MeViewModel } from '../../types/output/MeViewModel.js'
import { Request } from 'express'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { authQueryService } from '../../services/auth.query.service.js'
import { ResultStatus } from '../../../../common/result/result.js'
import { resultStatusToHttpStatusCode } from '../../../../common/result/resultStatusToHttpStatusCode.js'
import { ApiResponse } from '../../../../core/types/utils-types.js'

export async function meHandler(req: Request, res: ApiResponse<MeViewModel>) {
  try {
    const userId = req.user?.id as string

    if (!userId) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED_401)
    }

    const result = await authQueryService.me(userId)

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
