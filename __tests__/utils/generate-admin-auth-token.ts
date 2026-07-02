import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../src/core/auth/middleware/super-admin.guard-middleware.js'

export const generateAdminAuthToken = () => {
  const credentials = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`
  const token = Buffer.from(credentials).toString('base64')

  return `Basic ${token}`
}
