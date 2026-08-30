import { RefreshTokenPayload } from '../adapters/jwt.service.js'

declare global {
  namespace Express {
    interface Request {
      // будет declaration merging
      user?: {
        id: string
      }
      refreshPayload?: RefreshTokenPayload
    }
  }
}
