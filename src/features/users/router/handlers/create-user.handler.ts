import { Response } from 'express'
import { RequestWithBody } from '../../../../core/types/utils-types.js'
import { UserInputModel } from '../../types/input/UserInputModel.js'
import { UserViewModel } from '../../types/output/UserViewModel.js'
import { errorsHandlers } from '../../../../core/exceptions/errors-handlers.js'
import { usersService } from '../../services/users.service.js'
import { usersQueryRepository } from '../../repositories/users.query.repository.js'
import { HttpStatus } from '../../../../common/constants/constants.js'

export async function createUserHandler(
  req: RequestWithBody<UserInputModel>,
  res: Response<UserViewModel>
) {
  try {
    const createdUserId = await usersService.create(req.body)
    const createdUser = await usersQueryRepository.findByIdOrFail(createdUserId)
    res.status(HttpStatus.CREATED_201).json(createdUser)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
