export type SessionDB = {
  deviceId: string
  userId: string
  /** используется как версия токена */
  iat: Date
  deviceName: string
  ip: string
  exp: Date
}
