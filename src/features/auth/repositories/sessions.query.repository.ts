import { sessionsCollection } from '../../../db/collections.js'
import { WithId } from 'mongodb'
import { SessionDB } from '../types/sessionDB.js'
import { DeviceViewModel } from '../../security/types/output/DeviceViewModel.js'

export class SessionsQueryRepository {
  async findManyByUserId(userId: string): Promise<DeviceViewModel[]> {
    const sessions = await sessionsCollection
      .find({ userId, exp: { $gt: new Date() } })
      .toArray()

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
