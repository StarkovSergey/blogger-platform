import { MongoClient, Db } from 'mongodb'
import { SETTINGS } from '../settings/config.js'
import { initCollections } from './collections.js'

export let client: MongoClient

export async function runDB(url: string) {
  client = new MongoClient(url)
  const db: Db = client.db(SETTINGS.DB_NAME)

  initCollections(db)

  try {
    await client.connect()
    await db.command({ ping: 1 })
    console.log('✅ Connected to the database')
  } catch (e) {
    await client.close()
    throw new Error(`❌ Database not connected: ${e}`)
  }
}
