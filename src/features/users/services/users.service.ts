import { UserInputModel } from '../types/input/UserInputModel.js'
import { UserDB } from '../types/userDB.js'
import { DomainException } from '../../../core/exceptions/domain.exception.js'
import { UserErrorCode } from '../types/user-error-code.js'
import { UsersRepository } from '../repositories/users.repository.js'
import { PasswordHashService } from '../../../core/adapters/password-hash.service.js'

export class UsersService {
  usersRepository: UsersRepository
  passwordHashService: PasswordHashService

  constructor(
    usersRepository: UsersRepository,
    passwordHashService: PasswordHashService
  ) {
    this.usersRepository = usersRepository
    this.passwordHashService = passwordHashService
  }

  async create(userDto: UserInputModel): Promise<string> {
    const byLogin = await this.usersRepository.findByLogin(userDto.login)
    if (byLogin) {
      throw new DomainException(
        'login already exists',
        UserErrorCode.LoginExists,
        'login'
      )
    }

    const byEmail = await this.usersRepository.findByEmail(userDto.email)
    if (byEmail) {
      throw new DomainException(
        'email already exists',
        UserErrorCode.EmailExists,
        'email'
      )
    }

    const hash = await this.passwordHashService.generateHash(userDto.password)
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

    return await this.usersRepository.create(newUser)
  }

  async delete(id: string) {
    await this.usersRepository.delete(id)
  }
}
