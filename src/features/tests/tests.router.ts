import { Router, type Request, type Response } from 'express'
import { db } from '../../db/db.js'
import { HttpStatus } from '../../common/constants/constants.js'

export const testsRouter = Router({})

testsRouter.delete('/all-data', (req: Request, res: Response) => {
  db.blogs = []
  db.posts = []

  res.sendStatus(HttpStatus.NO_CONTENT_204)
})
