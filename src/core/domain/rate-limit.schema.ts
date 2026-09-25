import mongoose, { InferSchemaType, Model } from 'mongoose'
import { RATE_LIMIT_MAX_ATTEMPTS } from '../constants/constants.js'

export const rateLimitSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    collection: 'rate_limit',
  }
)

rateLimitSchema.index(
  { date: 1 },
  { expireAfterSeconds: RATE_LIMIT_MAX_ATTEMPTS }
)

export type RateLimitDB = InferSchemaType<typeof rateLimitSchema>

export const rateLimitModel: Model<RateLimitDB> = mongoose.model(
  'RateLimit',
  rateLimitSchema
)
