import {
  jwtSecondsToDate,
  RefreshTokenPayload,
} from '../../../core/adapters/jwt.service.js'
import { sessionsQueryRepository } from '../../auth/repositories/sessions.query.repository.js'
import { Result, ResultStatus } from '../../../common/result/result.js'
import { DeviceViewModel } from '../types/output/DeviceViewModel.js'
import { sessionsRepository } from '../../auth/repositories/sessions.repository.js'

export const securityService = {
  async getAllActiveSessions(
    refreshTokenPayload: RefreshTokenPayload
  ): Promise<Result<DeviceViewModel[]>> {
    const res = await sessionsQueryRepository.findManyByUserId(
      refreshTokenPayload.userId
    )

    return {
      status: ResultStatus.Success,
      data: res,
      extensions: [],
    }
  },
  async deleteSession(
    deviceId: string,
    currentUserId: string
  ): Promise<Result> {
    const session = await sessionsRepository.findSessionByDeviceId(deviceId)

    if (!session) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Session not fount',
        extensions: [],
        data: null,
      }
    }

    if (session.userId !== currentUserId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: 'Forbidden',
        extensions: [],
        data: null,
      }
    }

    const isSuccessDelete = await sessionsRepository.deleteSession(
      deviceId,
      session.iat
    )

    if (isSuccessDelete) {
      return {
        status: ResultStatus.Success,
        extensions: [],
        data: null,
      }
    }

    return {
      status: ResultStatus.Unauthorized,
      extensions: [],
      errorMessage: 'Some error',
      data: null,
    }
  },
  async deleteAllOtherSessions(
    deviceId: string,
    currentUserId: string,
    iat: number
  ): Promise<Result> {
    const session = await sessionsRepository.findSession(
      jwtSecondsToDate(iat),
      deviceId
    )

    if (!session) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Session not fount',
        extensions: [],
        data: null,
      }
    }

    if (session.userId !== currentUserId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: 'Forbidden',
        extensions: [],
        data: null,
      }
    }

    await sessionsRepository.deleteAllOtherSessions(deviceId, currentUserId)

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  },
}
