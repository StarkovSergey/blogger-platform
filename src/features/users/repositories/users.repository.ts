import { ObjectId } from 'mongodb'
import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'
import { EmailConfirmation, PasswordRecovery } from '../services/user.entity.js'
import { injectable } from 'inversify'
import { UserDB, userModel } from '../domain/user.schema.js'

@injectable()
export class UsersRepository {
  async create(user: UserDB): Promise<string> {
    const res = await userModel.create(user)
    return res._id.toString()
  }

  async delete(id: string) {
    const deleteResult = await userModel.findByIdAndDelete(id)

    if (!deleteResult) {
      throw new NotFoundException('User not found')
    }

    return
  }

  async findById(id: string) {
    return userModel.findById(id).lean()
  }
  async findByLogin(login: string) {
    return userModel
      .findOne({
        login,
      })
      .lean()
  }

  async findByEmail(email: string) {
    return userModel
      .findOne({
        email,
      })
      .lean()
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    return userModel
      .findOne({
        $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      })
      .lean()
  }

  async updateConfirmation(id: ObjectId) {
    const result = await userModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          'emailConfirmation.isConfirmed': true,
        },
      }
    )

    return result.modifiedCount === 1
  }

  async findUserByConfirmationCode(code: string) {
    return userModel
      .findOne({ 'emailConfirmation.confirmationCode': code })
      .lean()
  }

  async updateEmailConfirmation(
    _id: ObjectId,
    emailConfirmation: EmailConfirmation
  ) {
    const result = await userModel.updateOne(
      { _id },
      { $set: { emailConfirmation } }
    )

    return result.modifiedCount === 1
  }

  async findByRecoveryCode(recoveryCode: string) {
    return userModel
      .findOne({
        'passwordRecovery.recoveryCode': recoveryCode,
      })
      .lean()
  }

  async updatePasswordRecovery(
    _id: ObjectId,
    passwordRecovery: PasswordRecovery
  ) {
    const result = await userModel.updateOne(
      { _id },
      { $set: { passwordRecovery } }
    )

    return result.modifiedCount === 1
  }

  async updatePasswordHash(_id: ObjectId, passwordHash: string) {
    const result = await userModel.updateOne(
      { _id },
      {
        $set: {
          passwordHash,
          passwordRecovery: null,
        },
      }
    )

    return result.modifiedCount === 1
  }
}
