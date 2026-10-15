import mongoose, { HydratedDocument, InferSchemaType, Model } from 'mongoose'

export const sessionSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    iat: {
      type: Date,
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    exp: {
      type: Date,
      required: true,
    },
  },
  { collection: 'sessions' }
)

class SessionEntity {
  private constructor(
    private deviceId: string,
    private userId: string,
    private iat: Date,
    private deviceName: string,
    private ip: string,
    private exp: Date
  ) {}

  static createSession(dto: {
    deviceId: string
    userId: string
    iat: Date
    exp: Date
    deviceName: string
    ip: string
  }) {
    return new SessionModel({
      deviceId: dto.deviceId,
      userId: dto.userId,
      iat: dto.iat,
      exp: dto.exp,
      deviceName: dto.deviceName,
      ip: dto.ip,
    })
  }

  updateOnRefresh(dto: { iat: Date; exp: Date; ip: string }) {
    this.iat = dto.iat
    this.exp = dto.exp
    this.ip = dto.ip
  }
}

interface SessionMethods {
  updateOnRefresh(dto: { iat: Date; exp: Date; ip: string }): void
}

export type SessionDB = InferSchemaType<typeof sessionSchema>
export type SessionDocument = HydratedDocument<SessionDB, SessionMethods>
export type SessionModelType = Model<SessionDB, {}, SessionMethods> &
  typeof SessionEntity

sessionSchema.loadClass(SessionEntity)

export const SessionModel = mongoose.model<SessionDB, SessionModelType>(
  'Session',
  sessionSchema
)
