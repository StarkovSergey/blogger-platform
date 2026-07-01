export const HttpStatus = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
} as const

export type HTTP_STATUS_CODE = (typeof HttpStatus)[keyof typeof HttpStatus]
