import express from 'express'

export const app = express()

export const RouterPaths = {
  __tests__: '/__test__',
}

app.use(express.json())
