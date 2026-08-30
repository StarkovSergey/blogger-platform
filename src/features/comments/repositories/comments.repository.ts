import { commentsCollection } from '../../../db/collections.js'
import { CommentDB } from '../types/commentDB.js'
import { CommentInputModel } from '../types/input/CommentInputModel.js'
import { ObjectId } from 'mongodb'

export const commentsRepository = {
  async findById(id: string) {
    return commentsCollection.findOne({ _id: new ObjectId(id) })
  },
  async create(comment: CommentDB): Promise<string> {
    const insertResult = await commentsCollection.insertOne(comment)

    return insertResult.insertedId.toString()
  },
  async update(id: string, dto: CommentInputModel): Promise<boolean> {
    const updatedResult = await commentsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      { $set: dto }
    )

    return updatedResult.matchedCount > 0
  },
  async delete(id: string): Promise<boolean> {
    const deleteResult = await commentsCollection.deleteOne({
      _id: new ObjectId(id),
    })

    return deleteResult.deletedCount > 0
  },
}
