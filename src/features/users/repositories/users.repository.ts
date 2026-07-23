import { UserDB } from '../types/userDB.js'
import { usersCollection } from '../../../db/collections.js'
import { ObjectId } from 'mongodb'
import { NotFoundException } from '../../../core/exeptions/not-found.exception.js'

export const usersRepository = {
  async create(user: UserDB): Promise<string> {
    const insertResult = await usersCollection.insertOne(user)
    return insertResult.insertedId.toString()
  },
  async findByLogin(login: string) {
    return usersCollection.findOne({
      login,
    })
  },
  async findByEmail(email: string) {
    return usersCollection.findOne({
      email,
    })
  },
  async delete(id: string) {
    const deleteResult = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    })

    if (deleteResult.deletedCount < 1) {
      throw new NotFoundException('User not found')
    }

    return
  },
}
