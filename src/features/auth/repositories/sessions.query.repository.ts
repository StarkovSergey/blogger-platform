import { WithId } from 'mongodb'
import { DeviceViewModel } from '../../security/types/output/DeviceViewModel.js'
import { injectable } from 'inversify'
import { SessionDB, sessionModel } from '../domain/session.schema.js'

@injectable()
export class SessionsQueryRepository {
  async findManyByUserId(userId: string): Promise<DeviceViewModel[]> {
    const sessions = await sessionModel
      .find({ userId, exp: { $gt: new Date() } })
      .lean()

    return sessions.map(this._mapToDeviceViewModel)
  }
  _mapToDeviceViewModel(session: WithId<SessionDB>): DeviceViewModel {
    return {
      deviceId: session.deviceId,
      ip: session.ip,
      lastActiveDate: session.iat.toISOString(),
      title: session.deviceName,
    }
  }
}
