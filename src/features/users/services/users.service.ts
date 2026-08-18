import { UserInputModel } from '../types/input/UserInputModel.js'
import { UserDB } from '../types/userDB.js'
import { usersRepository } from '../repositories/users.repository.js'
import { DomainException } from '../../../core/exceptions/domain.exception.js'
import { UserErrorCode } from '../types/user-error-code.js'
import { passwordHashService } from '../../../core/adapters/password-hash.service.js'

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

    const hash = await passwordHashService.generateHash(userDto.password)
    const newUser: UserDB = {
      login: userDto.login,
      email: userDto.email,
      passwordHash: hash,
      createdAt: new Date(),
      emailConfirmation: {
        isConfirmed: true, // т.к. создаём через админа
        confirmationCode: '',
        expirationDate: new Date(),
      },
    }

    return await usersRepository.create(newUser)
  },
  async delete(id: string) {
    await usersRepository.delete(id)
  },
}
