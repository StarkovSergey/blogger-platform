import mongoose, { InferSchemaType, Model } from 'mongoose'

const emailConfirmationSchema = new mongoose.Schema({
  confirmationCode: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  isConfirmed: {
    type: Boolean,
    required: true,
  },
})

export const passwordRecoverySchema = {
  recoveryCode: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
}

export const userSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      minlength: 1,
      maxlength: 100,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      minlength: 1,
      maxlength: 100,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    emailConfirmation: {
      type: emailConfirmationSchema,
      required: true,
    },
    passwordRecovery: {
      type: passwordRecoverySchema,
      required: false,
    },
  },
  { collection: 'users' }
)

export type UserDB = InferSchemaType<typeof userSchema>
export const userModel: Model<UserDB> = mongoose.model('User', userSchema)
