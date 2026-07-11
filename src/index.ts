import express from 'express'
import { setupApp } from './setup-app.js'
import { SETTINGS } from './settings/config.js'
import { runDB } from './db/mongo.db.js'

const bootstrap = async () => {
  const app = express()
  setupApp(app)
  const PORT = SETTINGS.PORT

  await runDB(SETTINGS.MONGO_URL)

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })
}

bootstrap()
