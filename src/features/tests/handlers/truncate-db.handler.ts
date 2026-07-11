import { Request, Response } from 'express'
import { getAllCollections } from '../../../db/collections.js'
import { HttpStatus } from '../../../common/constants/constants.js'

export async function truncateDbHandler(req: Request, res: Response) {
  try {
    await Promise.all(
      getAllCollections().map((collection) => collection.deleteMany())
    )

    res.sendStatus(HttpStatus.NO_CONTENT_204)
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500)
  }
}
