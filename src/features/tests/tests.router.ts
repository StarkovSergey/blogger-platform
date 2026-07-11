import { Router } from 'express'
import { truncateDbHandler } from './handlers/truncate-db.handler.js'

export const testsRouter = Router({})

testsRouter.delete('/all-data', truncateDbHandler)
