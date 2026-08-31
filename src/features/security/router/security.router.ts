import { Router } from 'express'
import { refreshTokenGuard } from '../../../core/middleware/validation/refresh-token-guard.middleware.js'
import { getDevicesListHandler } from './handlers/get-devices-list.handler.js'
import { deleteDeviceSessionHandler } from './handlers/delete-device.handler.js'
import { terminateAllOtherSessionsHandler } from './handlers/terminate-all-other-sessions.handler.js'

export const securityRouter = Router()

export const SECURITY_ROUTER_PATHS = {
  DEVICES: '/devices',
  DEVICES_BY_ID: '/devices/:deviceId',
} as const

securityRouter.get(
  SECURITY_ROUTER_PATHS.DEVICES,
  refreshTokenGuard,
  getDevicesListHandler
)

securityRouter.delete(
  SECURITY_ROUTER_PATHS.DEVICES_BY_ID,
  refreshTokenGuard,
  deleteDeviceSessionHandler
)

securityRouter.delete(
  SECURITY_ROUTER_PATHS.DEVICES,
  refreshTokenGuard,
  terminateAllOtherSessionsHandler
)
