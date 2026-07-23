import { Response } from 'express'
import { UserQueryInput } from '../../types/input/user-query-input.js'
import { RequestWithQuery } from '../../../../core/types/utils-types.js'
import { Pagination } from '../../../../core/types/paginated-output.js'
import { UserViewModel } from '../../types/output/UserViewModel.js'
import { usersQueryRepository } from '../../repositories/users.query.repository.js'
import { errorsHandlers } from '../../../../core/exceptions/errors-handlers.js'

export const getUserListHandler = async (
  req: RequestWithQuery<UserQueryInput>,
  res: Response<Pagination<UserViewModel>>
) => {
  try {
    const queryInput = req.query
    const paginatedOutput = await usersQueryRepository.findMany(queryInput)

    res.json(paginatedOutput)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
