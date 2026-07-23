import {
  ApiResponse,
  RequestWithParams,
} from '../../../../core/types/utils-types.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { errorsHandlers } from '../../../../core/exceptions/errors-handlers.js'
import { usersService } from '../../services/users.service.js'

export async function deleteUserHandler(
  req: RequestWithParams<{ id: string }>,
  res: ApiResponse<void>
) {
  try {
    const id = req.params.id
    await usersService.delete(id)

    res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
