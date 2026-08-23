import { refreshBlackListRepository } from '../repositories/refresh-black-list.repository.js'
import { Result, ResultStatus } from '../../../common/result/result.js'
import { jwtService } from '../../../core/adapters/jwt.service.js'

export const refreshBlackListService = {
  async add({
    refreshToken,
    userId,
  }: {
    refreshToken: string
    userId: string
  }): Promise<Result> {
    const isSuccess = await refreshBlackListRepository.add({
      refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // через 1 час
    })

    if (!isSuccess) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [],
        data: null,
      }
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    }
  },
  async isInBlackList(refreshToken: string) {
    return await refreshBlackListRepository.has(refreshToken)
  },
  async createNewTokens(
    refreshToken: string,
    userId: string
  ): Promise<Result<{ accessToken: string; newRefreshToken: string }>> {
    const isInBlackList = await refreshBlackListRepository.has(refreshToken)

    if (isInBlackList) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [],
        data: null,
        errorMessage: 'Invalid refresh token',
      }
    }

    const accessToken = await jwtService.createJWT(userId)
    const newRefreshToken = await jwtService.createRefreshJWT(userId)

    await refreshBlackListService.add({ refreshToken, userId })

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: { accessToken, newRefreshToken },
    }
  },
}
