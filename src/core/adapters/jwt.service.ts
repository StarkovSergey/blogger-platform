import jwt, { SignOptions } from 'jsonwebtoken'
import { SETTINGS } from '../../settings/config.js'

export type RefreshTokenPayload = {
  userId: string
  deviceId: string
  iat: number
  exp: number
}

export type AccessTokenPayload = Omit<RefreshTokenPayload, 'deviceId'>

export const jwtService = {
  async createJWT(userId: string) {
    return jwt.sign({ userId }, SETTINGS.JWT_SECRET, {
      expiresIn:
        `${SETTINGS.JWT_TOKEN_EXP_TIME_SECONDS}s` as SignOptions['expiresIn'],
    })
  },
  async createRefreshJWT(userId: string, deviceId: string) {
    return jwt.sign({ userId, deviceId }, SETTINGS.JWT_REFRESH_SECRET, {
      expiresIn:
        `${SETTINGS.JWT_REFRESH_TOKEN_EXP_TIME_SECONDS}s` as SignOptions['expiresIn'],
    })
  },
  async verifyAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, SETTINGS.JWT_SECRET)

      if (typeof payload === 'string' || !isAccessTokenPayload(payload)) {
        return null
      }

      return payload
    } catch (e) {
      console.error('Token verify some error')
      return null
    }
  },
  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
    try {
      const payload = jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET)

      if (typeof payload === 'string' || !isRefreshTokenPayload(payload)) {
        return null
      }

      return payload
    } catch (e) {
      console.error('Token verify some error')
      return null
    }
  },
  decodeToken(token: string): RefreshTokenPayload {
    const payload = jwt.decode(token)

    if (
      !payload ||
      typeof payload === 'string' ||
      !isRefreshTokenPayload(payload)
    ) {
      throw new Error('Failed to decode refresh token')
    }
    return payload
  },
}

export function jwtSecondsToDate(seconds: number) {
  return new Date(seconds * 1000)
}

function isRefreshTokenPayload(
  payload: jwt.JwtPayload
): payload is RefreshTokenPayload {
  return (
    typeof payload.userId === 'string' &&
    typeof payload.deviceId === 'string' &&
    typeof payload.iat === 'number' &&
    typeof payload.exp === 'number'
  )
}

function isAccessTokenPayload(
  payload: jwt.JwtPayload
): payload is AccessTokenPayload {
  return (
    typeof payload.userId === 'string' &&
    typeof payload.iat === 'number' &&
    typeof payload.exp === 'number'
  )
}
