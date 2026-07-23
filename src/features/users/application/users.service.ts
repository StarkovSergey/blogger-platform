import { UserInputModel } from '../types/input/UserInputModel.js'
import bcrypt from 'bcrypt'
import { UserDB } from '../types/userDB.js'
import { usersRepository } from '../repositories/users.repository.js'
import { DomainException } from '../../../core/exeptions/domain.exception.js'
import { UserErrorCode } from '../types/user-error-code.js'

export const usersService = {
  async create(userDto: UserInputModel): Promise<string> {
    const byLogin = await usersRepository.findByLogin(userDto.login)
    if (byLogin) {
      throw new DomainException(
        'login already exists',
        UserErrorCode.LoginExists,
        'login'
      )
    }

    const byEmail = await usersRepository.findByEmail(userDto.email)
    if (byEmail) {
      throw new DomainException(
        'email already exists',
        UserErrorCode.EmailExists,
        'email'
      )
    }

    const hash = await bcrypt.hash(userDto.password, 12)
    const newUser: UserDB = {
      login: userDto.login,
      email: userDto.email,
      passwordHash: hash,
      createdAt: new Date(),
    }

    return await usersRepository.create(newUser)
  },
  async delete(id: string) {
    await usersRepository.delete(id)
  },
}
