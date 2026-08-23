const env = process.env

export const ADMIN_USERNAME = env.ADMIN_USERNAME || 'admin'
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'qwerty'

// TODO: zod validation for env variables

export const SETTINGS = {
  PORT: env.PORT || 5001,
  MONGO_URL: env.MONGO_URL || 'mongodb://localhost:27017',
  MONGO_URL_TEST: env.MONGO_URL_TEST || 'mongodb://localhost:27017',
  DB_NAME: env.DB_NAME || 'blogger-platform',
  JWT_SECRET: process.env.JWT_SECRET || '123',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '333',
  JWT_TOKEN_EXP_TIME_SECONDS: process.env.JWT_TOKEN_EXP_TIME_SECONDS || 10,
  JWT_REFRESH_TOKEN_EXP_TIME_SECONDS:
    process.env.JWT_REFRESH_TOKEN_EXP_TIME_SECONDS || 20,
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
}
