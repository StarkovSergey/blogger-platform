import { injectable } from 'inversify'
import {
  SessionDB,
  SessionDocument,
  SessionModel,
} from '../domain/session.schema.js'

@injectable()
export class SessionsRepository {
  async save(session: SessionDocument) {
    return await session.save()
  }

  async findSession(iat: Date, deviceId: string) {
    return SessionModel.findOne({
      iat,
      deviceId,
    })
  }
  async findSessionByDeviceId(deviceId: string) {
    return SessionModel.findOne({
      deviceId,
    }).lean()
  }
  async findAllSessions() {
    return SessionModel.find().lean()
  }
  async updateSession(
    deviceId: string,
    currentIat: Date,
    dto: { iat: Date; exp: Date; ip: string }
  ) {
    const updateResult = await SessionModel.updateOne(
      {
        iat: currentIat,
        deviceId,
      },
      {
        $set: {
          iat: dto.iat,
          exp: dto.exp,
          ip: dto.ip,
        },
      }
    )

    return updateResult.matchedCount === 1
  }
  async deleteSession(deviceId: string, iat: Date) {
    const result = await SessionModel.deleteOne({
      deviceId,
      iat,
    })

    return result.deletedCount > 0
  }
  async deleteAllOtherSessions(currentDeviceId: string, userId: string) {
    const result = await SessionModel.deleteMany({
      userId,
      deviceId: { $ne: currentDeviceId },
    })

    return result.deletedCount
  }
}
