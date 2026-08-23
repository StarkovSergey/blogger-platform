import jwt, { SignOptions } from 'jsonwebtoken'
import { SETTINGS } from '../../settings/config.js'

export const jwtService = {
  async createJWT(userId: string) {
    return jwt.sign({ userId }, SETTINGS.JWT_SECRET, {
      expiresIn:
        `${SETTINGS.JWT_TOKEN_EXP_TIME_SECONDS}s` as SignOptions['expiresIn'],
    })
  },
  async createRefreshJWT(userId: string) {
    return jwt.sign({ userId }, SETTINGS.JWT_REFRESH_SECRET, {
      expiresIn:
        `${SETTINGS.JWT_REFRESH_TOKEN_EXP_TIME_SECONDS}s` as SignOptions['expiresIn'],
    })
  },
  async verifyToken(
    token: string,
    type: 'access' | 'refresh'
  ): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(
        token,
        type === 'access' ? SETTINGS.JWT_SECRET : SETTINGS.JWT_REFRESH_SECRET
      ) as { userId: string }
    } catch (e) {
      console.error('Token verify some error')
      return null
    }
  },
}
