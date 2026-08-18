import { randomUUID } from 'node:crypto'

const EMAIL_CONFIRMATION_CODE_EXPIRATION_MS = 10 * 60 * 1000 // 10 минут

export type EmailConfirmation = {
  confirmationCode: string
  expirationDate: Date
  isConfirmed: boolean
}

export class User {
  login: string
  email: string
  passwordHash: string
  createdAt: Date
  emailConfirmation: EmailConfirmation

  constructor(login: string, email: string, hash: string) {
    this.login = login
    this.email = email
    this.passwordHash = hash
    this.createdAt = new Date()
    this.emailConfirmation = {
      expirationDate: new Date(
        Date.now() + EMAIL_CONFIRMATION_CODE_EXPIRATION_MS
      ),
      confirmationCode: randomUUID(),
      isConfirmed: false,
    }
  }
}
