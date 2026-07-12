import express from 'express'
import { setupApp } from './setup-app.js'
import { SETTINGS } from './settings/config.js'
import { runDB } from './db/mongo.db.js'

const app = express()
setupApp(app)

await runDB(SETTINGS.MONGO_URL)

// на Vercel не запускаем сервер, там используется serverless функция
if (!process.env.VERCEL) {
  app.listen(SETTINGS.PORT, () => {
    console.log(`Example app listening on port ${SETTINGS.PORT}`)
  })
}

export default app
