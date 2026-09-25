import { SETTINGS } from '../settings/config.js'
import mongoose from 'mongoose'

export async function runDB(url: string) {
  try {
    await mongoose.connect(url, {
      dbName: SETTINGS.DB_NAME,
    })

    const db = mongoose.connection.db

    if (!db) {
      throw new Error('Mongoose connected, but db is undefined')
    }

    console.log('✅ Connected to the database')
  } catch (e) {
    await mongoose.disconnect()

    throw new Error(`❌ Database not connected: ${e}`)
  }
}

// для тестов
export async function stopDb() {
  await mongoose.connection.close()
}
