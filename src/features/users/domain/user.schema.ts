import mongoose, { HydratedDocument, InferSchemaType, Model } from 'mongoose'
import { EMAIL_CONFIRMATION_CODE_EXPIRATION_MS } from '../services/user.entity.js'
import { randomUUID } from 'node:crypto'

const RECOVERY_PASSWORD_CODE_EXPIRATION_MS = 5 * 60 * 1000 // 5 минут

const emailConfirmationSchema = new mongoose.Schema({
  confirmationCode: {
    type: String,
    required: true,
    default: randomUUID(),
  },
  expirationDate: {
    type: Date,
    required: true,
    default: new Date(Date.now() + EMAIL_CONFIRMATION_CODE_EXPIRATION_MS),
  },
  isConfirmed: {
    type: Boolean,
    required: true,
    default: false,
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
      default: new Date(),
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

class UserEntity {
  private constructor(
    private login: string,
    private email: string,
    private passwordHash: string,
    private createdAt: Date,
    private emailConfirmation: {
      confirmationCode: string
      expirationDate: Date
      isConfirmed: boolean
    },
    private passwordRecovery?: {
      recoveryCode: string
      expirationDate: Date
    }
  ) {}

  static createUser(dto: {
    login: string
    email: string
    passwordHash: string
    isConfirmed?: boolean
  }) {
    const user = new UserModel({
      login: dto.login,
      email: dto.email,
      passwordHash: dto.passwordHash,
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: new Date(
          Date.now() + EMAIL_CONFIRMATION_CODE_EXPIRATION_MS
        ),
        isConfirmed: dto.isConfirmed ?? false,
      },
    })
    return user
  }

  updateConfirmation(code: string) {
    if (
      this.emailConfirmation.isConfirmed ||
      this.emailConfirmation.confirmationCode !== code ||
      this.emailConfirmation.expirationDate < new Date()
    ) {
      return false
    }

    this.emailConfirmation.isConfirmed = true
    return true
  }

  resendEmailConfirmation(): boolean {
    if (this.emailConfirmation.isConfirmed) return false

    this.emailConfirmation = {
      confirmationCode: randomUUID(),
      expirationDate: new Date(
        Date.now() + EMAIL_CONFIRMATION_CODE_EXPIRATION_MS
      ),
      isConfirmed: false,
    }

    return true
  }

  requestPasswordRecovery() {
    const recoveryCode = randomUUID()

    this.passwordRecovery = {
      recoveryCode,
      expirationDate: new Date(
        Date.now() + RECOVERY_PASSWORD_CODE_EXPIRATION_MS
      ),
    }

    return recoveryCode
  }

  updatePassword(recoveryCode: string, newPasswordHash: string) {
    if (
      !this.passwordRecovery ||
      this.passwordRecovery?.recoveryCode !== recoveryCode ||
      this.passwordRecovery?.expirationDate < new Date()
    ) {
      return false
    }

    this.passwordHash = newPasswordHash
    this.passwordRecovery = undefined
    return true
  }
}

interface UserMethods {
  updateConfirmation(code: string): boolean
  resendEmailConfirmation(): boolean
  requestPasswordRecovery(): string
  updatePassword(recoveryCode: string, newPasswordHash: string): boolean
}

userSchema.loadClass(UserEntity)

export type UserDB = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<UserDB, UserMethods>
export type UserModelType = Model<UserDB, {}, UserMethods> & typeof UserEntity

export const UserModel = mongoose.model<UserDB, UserModelType>(
  'User',
  userSchema
)
