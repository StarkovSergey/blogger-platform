import { LoginInputModel } from '../types/input/login-input-model.js'
import { usersRepository } from '../../users/repositories/users.repository.js'
import { passwordHashService } from '../../../core/adapters/password-hash.service.js'
import { jwtService } from '../../../core/adapters/jwt.service.js'
import { Result, ResultStatus } from '../../../common/result/result.js'
import { LoginSuccessViewModel } from '../types/output/LoginSuccessViewModel.js'
import { RegistrationInputModel } from '../types/input/registration-input-model.js'
import { EmailConfirmation, User } from '../../users/services/user.entity.js'
import { emailService } from '../../../core/adapters/email.service.js'
import { emailManager } from '../../../core/constants/managers/email-manager.js'
import { randomUUID } from 'node:crypto'

export const authService = {
  async registerUser({
    login,
    email,
    password,
  }: RegistrationInputModel): Promise<Result> {
    const isEmailExists = await usersRepository.findByEmail(email)

    if (isEmailExists) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [{ field: 'email', message: 'Already Registered' }],
      }
    }

    const isLoginExists = await usersRepository.findByLogin(login)

    if (isLoginExists) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [{ field: 'login', message: 'Already Registered' }],
      }
    }

    const passwordHash = await passwordHashService.generateHash(password)
    const newUser = new User(login, email, passwordHash)

    await usersRepository.create(newUser)

    emailService
      .sendEmail({
        to: newUser.email,
        subject: emailManager.registration.subject,
        text: emailManager.registration.email(
          newUser.emailConfirmation.confirmationCode
        ),
      })
      .catch((err) => {
        // тут можно сделать либо retry, либо rollback (удалить юзера)
        console.error('error in sending email:', err)
      })

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  },
  async login(
    loginDto: LoginInputModel
  ): Promise<Result<LoginSuccessViewModel & { refreshToken: string }>> {
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

    const userId = user._id.toString()
    const accessToken = await jwtService.createJWT(userId)
    const refreshToken = await jwtService.createRefreshJWT(userId)

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    }
  },
  async confirmEmail(code: string): Promise<Result> {
    const user = await usersRepository.findUserByConfirmationCode(code)

    const isInvalidCode =
      !user ||
      user.emailConfirmation.isConfirmed ||
      user.emailConfirmation.expirationDate < new Date()

    if (isInvalidCode) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'code', message: 'Incorrect confirmation code' }],
        data: null,
      }
    }

    const isUpdated = await usersRepository.updateConfirmation(user._id)

    if (!isUpdated) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [],
      }
    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  },
  async emailResending(email: string): Promise<Result> {
    // 1. Проверить, что пользователь с таким email существует
    // 2. Обновить у пользователя confirmation code и сопутствующие поля
    // 3. Отправить новый email
    const user = await usersRepository.findByEmail(email)

    if (!user || user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'email', message: 'Email already confirmed or not found' },
        ],
      }
    }

    const emailConfirmation: EmailConfirmation = {
      confirmationCode: randomUUID(),
      expirationDate: new Date(Date.now() + 10 * 60 * 1000),
      isConfirmed: false,
    }

    const isUpdated = await usersRepository.updateEmailConfirmation(
      user._id,
      emailConfirmation
    )

    if (!isUpdated) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'email', message: 'Email already confirmed or not found' },
        ],
      }
    }

    emailService
      .sendEmail({
        to: user.email,
        subject: emailManager.registration.subject,
        text: emailManager.registration.email(
          emailConfirmation.confirmationCode
        ),
      })
      .catch((err) => {
        // тут можно сделать либо retry, либо rollback (удалить юзера)
        console.error('error in sending email:', err)
      })

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  },
}
