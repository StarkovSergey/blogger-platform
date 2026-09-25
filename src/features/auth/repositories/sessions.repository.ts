import { injectable } from 'inversify'
import { SessionDB, sessionModel } from '../domain/session.schema.js'

@injectable()
export class SessionsRepository {
  async addSession(session: SessionDB) {
    const insertResult = await sessionModel.create(session)
    return Boolean(insertResult._id)
  }
  async findSession(iat: Date, deviceId: string) {
    return sessionModel
      .findOne({
        iat,
        deviceId,
      })
      .lean()
  }
  async findSessionByDeviceId(deviceId: string) {
    return sessionModel
      .findOne({
        deviceId,
      })
      .lean()
  }
  async findAllSessions() {
    return sessionModel.find().lean()
  }
  async updateSession(
    deviceId: string,
    currentIat: Date,
    dto: { iat: Date; exp: Date; ip: string }
  ) {
    const updateResult = await sessionModel.updateOne(
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
    const result = await sessionModel.deleteOne({
      deviceId,
      iat,
    })

    return result.deletedCount > 0
  }
  async deleteAllOtherSessions(currentDeviceId: string, userId: string) {
    const result = await sessionModel.deleteMany({
      userId,
      deviceId: { $ne: currentDeviceId },
    })

    return result.deletedCount
  }
}
