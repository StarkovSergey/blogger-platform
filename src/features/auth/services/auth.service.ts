import { LoginInputModel } from '../types/input/login-input-model.js'
import { usersRepository } from '../../users/repositories/users.repository.js'
import { UnauthorizedException } from '../../../core/exceptions/unauthorized.exception.js'
import { hashService } from '../../../core/adapters/hash.service.js'

export const authService = {
  async login(loginDto: LoginInputModel) {
    const user = await usersRepository.findByLoginOrEmail(loginDto.loginOrEmail)

    if (!user) {
      throw new UnauthorizedException()
    }

    const isCorrectCredentials = await hashService.checkPassword(
      loginDto.password,
      user.passwordHash
    )

    if (!isCorrectCredentials) {
      throw new UnauthorizedException()
    }
  },
}
