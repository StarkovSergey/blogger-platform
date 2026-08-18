import { usersCollection } from '../../../db/collections.js'
import { ObjectId } from 'mongodb'
import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'
import { EmailConfirmation, User } from '../services/user.entity.js'

export const usersRepository = {
  async create(user: User): Promise<string> {
    const insertResult = await usersCollection.insertOne(user)
    return insertResult.insertedId.toString()
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
  async findById(id: string) {
    return usersCollection.findOne({
      _id: new ObjectId(id),
    })
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
  async findByLoginOrEmail(loginOrEmail: string) {
    return usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    })
  },
  async doesExistByLoginOrEmail(
    login: string,
    email: string
  ): Promise<boolean> {
    const user = await usersCollection.findOne({
      $or: [{ email }, { login }],
    })

    return Boolean(user)
  },
  async updateConfirmation(_id: ObjectId) {
    const result = await usersCollection.updateOne(
      { _id },
      {
        $set: {
          'emailConfirmation.isConfirmed': true,
        },
      }
    )

    return result.modifiedCount === 1
  },
  async findUserByConfirmationCode(code: string) {
    return usersCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    })
  },
  async updateEmailConfirmation(
    _id: ObjectId,
    emailConfirmation: EmailConfirmation
  ) {
    const result = await usersCollection.updateOne(
      { _id },
      { $set: { emailConfirmation } }
    )

    return result.modifiedCount === 1
  },
}
