import { SessionDB } from '../types/sessionDB.js'
import { sessionsCollection } from '../../../db/collections.js'

export const sessionsRepository = {
  async addSession(session: SessionDB) {
    const insertResult = await sessionsCollection.insertOne(session)
    return Boolean(insertResult.insertedId)
  },
  async findSession(iat: Date, deviceId: string) {
    return sessionsCollection.findOne({
      iat,
      deviceId,
    })
  },
  async findAllSessions() {
    return sessionsCollection.find().toArray()
  },
  async updateSession(
    deviceId: string,
    currentIat: Date,
    dto: { iat: Date; exp: Date; ip: string }
  ) {
    const updateResult = await sessionsCollection.updateOne(
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
  },
  async deleteSession(deviceId: string, iat: Date) {
    const result = await sessionsCollection.deleteOne({
      deviceId,
      iat,
    })

    return result.deletedCount > 0
  },
}
