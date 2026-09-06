import { randomUUID } from 'node:crypto'

export const EMAIL_CONFIRMATION_CODE_EXPIRATION_MS = 10 * 60 * 1000 // 10 минут

export type EmailConfirmation = {
  confirmationCode: string
  expirationDate: Date
  isConfirmed: boolean
}

export type PasswordRecovery = {
  recoveryCode: string
  expirationDate: Date
}

export class User {
  login: string
  email: string
  passwordHash: string
  createdAt: Date
  emailConfirmation: EmailConfirmation
  passwordRecovery: PasswordRecovery | null

  constructor(
    login: string,
    email: string,
    hash: string,
    isConfirmed: boolean = false
  ) {
    this.login = login
    this.email = email
    this.passwordHash = hash
    this.createdAt = new Date()
    this.emailConfirmation = {
      expirationDate: new Date(
        Date.now() + EMAIL_CONFIRMATION_CODE_EXPIRATION_MS
      ),
      confirmationCode: randomUUID(),
      isConfirmed,
    }
    this.passwordRecovery = null
  }
}
