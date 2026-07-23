import { RequestWithBody } from '../../../../core/types/utils-types.js'
import { Response } from 'express'
import { LoginInputModel } from '../../types/input/login-input-model.js'
import { errorsHandlers } from '../../../../core/exceptions/errors-handlers.js'
import { authService } from '../../services/auth.service.js'
import { HttpStatus } from '../../../../common/constants/constants.js'

export async function loginHandler(
  req: RequestWithBody<LoginInputModel>,
  res: Response
) {
  try {
    await authService.login(req.body)

    res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
