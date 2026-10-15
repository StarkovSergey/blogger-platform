import { NotFoundException } from '../../../core/exceptions/not-found.exception.js'
import { injectable } from 'inversify'
import { UserDB, UserDocument, UserModel } from '../domain/user.schema.js'

@injectable()
export class UsersRepository {
  async save(user: UserDocument) {
    return user.save()
  }

  async create(user: UserDB): Promise<string> {
    const res = await UserModel.create(user)
    return res._id.toString()
  }

  async delete(id: string) {
    const deleteResult = await UserModel.findByIdAndDelete(id)

    if (!deleteResult) {
      throw new NotFoundException('User not found')
    }

    return
  }

  async findById(id: string) {
    return UserModel.findById(id).lean()
  }
  async findByLogin(login: string) {
    return UserModel.findOne({
      login,
    }).lean()
  }

  async findByEmail(email: string) {
    return UserModel.findOne({
      email,
    })
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    return UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    }).lean()
  }

  async findUserByConfirmationCode(code: string): Promise<UserDocument | null> {
    return UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    })
  }

  async findByRecoveryCode(recoveryCode: string) {
    return UserModel.findOne({
      'passwordRecovery.recoveryCode': recoveryCode,
    })
  }
}
