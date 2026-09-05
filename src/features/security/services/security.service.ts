import {
  jwtSecondsToDate,
  RefreshTokenPayload,
} from '../../../core/adapters/jwt.service.js'
import { Result, ResultStatus } from '../../../common/result/result.js'
import { DeviceViewModel } from '../types/output/DeviceViewModel.js'
import { SessionsQueryRepository } from '../../auth/repositories/sessions.query.repository.js'
import { SessionsRepository } from '../../auth/repositories/sessions.repository.js'

export class SecurityService {
  sessionsRepository: SessionsRepository
  sessionsQueryRepository: SessionsQueryRepository

  constructor(
    sessionsRepository: SessionsRepository,
    sessionsQueryRepository: SessionsQueryRepository
  ) {
    this.sessionsRepository = sessionsRepository
    this.sessionsQueryRepository = sessionsQueryRepository
  }

  async getAllActiveSessions(
    refreshTokenPayload: RefreshTokenPayload
  ): Promise<Result<DeviceViewModel[]>> {
    const res = await this.sessionsQueryRepository.findManyByUserId(
      refreshTokenPayload.userId
    )

    return {
      status: ResultStatus.Success,
      data: res,
      extensions: [],
    }
  }

  async deleteSession(
    deviceId: string,
    currentUserId: string
  ): Promise<Result> {
    const session =
      await this.sessionsRepository.findSessionByDeviceId(deviceId)

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

    const isSuccessDelete = await this.sessionsRepository.deleteSession(
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
  }

  async deleteAllOtherSessions(
    deviceId: string,
    currentUserId: string,
    iat: number
  ): Promise<Result> {
    const session = await this.sessionsRepository.findSession(
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

    await this.sessionsRepository.deleteAllOtherSessions(
      deviceId,
      currentUserId
    )

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  }
}
