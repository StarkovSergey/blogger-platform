import { beforeAll } from 'vitest'
import { runDB } from '../../src/db/mongo.db.js'
import { SETTINGS } from '../../src/settings/config.js'

let isDbConnected = false

beforeAll(async () => {
  if (!isDbConnected) {
    await runDB(SETTINGS.MONGO_URL_TEST)
    isDbConnected = true
  }
})
