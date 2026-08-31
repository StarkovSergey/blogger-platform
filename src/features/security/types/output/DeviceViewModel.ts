export type DeviceViewModel = {
  ip: string
  /** Device name: for example Chrome 105 (received by parsing http header "user-agent") */
  title: string
  /** Date of the last generating of refresh/access tokens */
  lastActiveDate: string
  deviceId: string
}
