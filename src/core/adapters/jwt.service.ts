import jwt, { SignOptions } from 'jsonwebtoken'
import { SETTINGS } from '../../settings/config.js'

export const jwtService = {
  async createJWT(userId: string) {
    return jwt.sign({ userId }, SETTINGS.JWT_SECRET, {
      expiresIn: SETTINGS.JWT_TOKEN_EXP_TIME as SignOptions['expiresIn'],
    })
  },
  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.JWT_SECRET) as { userId: string }
    } catch (e) {
      console.error('Token verify some error')
      return null
    }
  },
}
