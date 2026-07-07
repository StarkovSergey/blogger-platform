import { describe } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'

describe('Posts API', () => {
  const app = express()
  setupApp(app)
})
