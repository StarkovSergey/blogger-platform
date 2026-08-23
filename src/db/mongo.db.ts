import { MongoClient, Db } from 'mongodb'
import { SETTINGS } from '../settings/config.js'
import { initCollections } from './collections.js'

export let client: MongoClient

export async function runDB(url: string) {
  client = new MongoClient(url)

  try {
    await client.connect()
    const db: Db = client.db(SETTINGS.DB_NAME)

    await initCollections(db)
    console.log('✅ Connected to the database')
  } catch (e) {
    await client.close()
    throw new Error(`❌ Database not connected: ${e}`)
  }
}

// для тестов
export async function stopDb() {
  if (!client) {
    throw new Error('❌ No active client')
  }
  await client.close()
}
