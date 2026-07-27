import { Result, ResultStatus } from '../../../common/result/result.js'
import { MeViewModel } from '../types/output/MeViewModel.js'
import { usersQueryRepository } from '../../users/repositories/users.query.repository.js'

export const authQueryService = {
  async me(userId: string): Promise<Result<MeViewModel>> {
    const user = await usersQueryRepository.findById(userId)

    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        extensions: [],
        data: null,
      }
    }

    return {
      status: ResultStatus.Success,
      data: {
        login: user.login,
        email: user.email,
        userId: user.id,
      },
      extensions: [],
    }
  },
}
