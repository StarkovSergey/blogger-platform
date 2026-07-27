import { LoginInputModel } from '../types/input/login-input-model.js'
import { usersRepository } from '../../users/repositories/users.repository.js'
import { passwordHashService } from '../../../core/adapters/password-hash.service.js'
import { jwtService } from '../../../core/adapters/jwt.service.js'
import { Result, ResultStatus } from '../../../common/result/result.js'
import { LoginSuccessViewModel } from '../types/output/LoginSuccessViewModel.js'

export const authService = {
  async login(
    loginDto: LoginInputModel
  ): Promise<Result<LoginSuccessViewModel>> {
    const user = await usersRepository.findByLoginOrEmail(loginDto.loginOrEmail)

    const isCorrectCredentials = user
      ? await passwordHashService.checkPassword(
          loginDto.password,
          user.passwordHash
        )
      : false

    if (!user || !isCorrectCredentials) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
        data: null,
      }
    }

    const accessToken = await jwtService.createJWT(user._id.toString())

    return {
      status: ResultStatus.Success,
      data: { accessToken },
      extensions: [],
    }
  },
}
