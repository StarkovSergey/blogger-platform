import bcrypt from 'bcrypt'
import { injectable } from 'inversify'

@injectable()
export class PasswordHashService {
  async generateHash(password: string) {
    return await bcrypt.hash(password, 12)
  }

  async checkPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
  }
}
