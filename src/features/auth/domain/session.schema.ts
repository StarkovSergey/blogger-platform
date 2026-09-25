import mongoose, { InferSchemaType, Model } from 'mongoose'

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

export type SessionDB = InferSchemaType<typeof sessionSchema>
export const sessionModel: Model<SessionDB> = mongoose.model(
  'Session',
  sessionSchema
)
