import { RefreshBlackListItemDB } from '../types/RefreshBlackListItem.js'
import { refreshBlackListCollection } from '../../../db/collections.js'

export const refreshBlackListRepository = {
  async add(dto: RefreshBlackListItemDB): Promise<boolean> {
    const insertedResult = await refreshBlackListCollection.insertOne(dto)
    return Boolean(insertedResult.insertedId)
  },
  async delete(refreshToken: string) {
    const deleteResult = await refreshBlackListCollection.deleteOne({
      refreshToken,
    })

    return deleteResult.deletedCount > 0
  },
  async has(refreshToken: string) {
    const result = await refreshBlackListCollection.findOne({ refreshToken })

    return Boolean(result)
  },
}
