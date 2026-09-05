import { LoginInputModel } from '../types/input/login-input-model.js'
import {
  jwtSecondsToDate,
  JwtService,
  RefreshTokenPayload,
} from '../../../core/adapters/jwt.service.js'
import { Result, ResultStatus } from '../../../common/result/result.js'
import { LoginSuccessViewModel } from '../types/output/LoginSuccessViewModel.js'
import { RegistrationInputModel } from '../types/input/registration-input-model.js'
import { EmailConfirmation, User } from '../../users/services/user.entity.js'
import { emailManager } from '../../../core/constants/managers/email-manager.js'
import { randomUUID } from 'node:crypto'
import { SessionDB } from '../types/sessionDB.js'
import { SessionsRepository } from '../repositories/sessions.repository.js'
import { UsersRepository } from '../../users/repositories/users.repository.js'
import { EmailService } from '../../../core/adapters/email.service.js'
import { PasswordHashService } from '../../../core/adapters/password-hash.service.js'

export class AuthService {
  sessionsRepository: SessionsRepository
  usersRepository: UsersRepository
  emailService: EmailService
  jwtService: JwtService
  passwordHashService: PasswordHashService

  constructor(
    sessionsRepository: SessionsRepository,
    usersRepository: UsersRepository,
    emailService: EmailService,
    jwtService: JwtService,
    passwordHashService: PasswordHashService
  ) {
    this.sessionsRepository = sessionsRepository
    this.usersRepository = usersRepository
    this.emailService = emailService
    this.jwtService = jwtService
    this.passwordHashService = passwordHashService
  }

  async registerUser({
    login,
    email,
    password,
  }: RegistrationInputModel): Promise<Result> {
    const isEmailExists = await this.usersRepository.findByEmail(email)

    if (isEmailExists) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [{ field: 'email', message: 'Already Registered' }],
      }
    }

    const isLoginExists = await this.usersRepository.findByLogin(login)

    if (isLoginExists) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [{ field: 'login', message: 'Already Registered' }],
      }
    }

    const passwordHash = await this.passwordHashService.generateHash(password)
    const newUser = new User(login, email, passwordHash)

    await this.usersRepository.create(newUser)

    this.emailService
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
  }

  async login(
    loginDto: LoginInputModel,
    meta: { ip: string; deviceName: string }
  ): Promise<Result<LoginSuccessViewModel & { refreshToken: string }>> {
    const user = await this.usersRepository.findByLoginOrEmail(
      loginDto.loginOrEmail
    )

    const isCorrectCredentials = user
      ? await this.passwordHashService.checkPassword(
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
    const deviceId = crypto.randomUUID()
    const accessToken = await this.jwtService.createJWT(userId)
    const refreshToken = await this.jwtService.createRefreshJWT(
      userId,
      deviceId
    )

    const refreshTokenPayload = this.jwtService.decodeToken(refreshToken)

    const session: SessionDB = {
      userId,
      exp: jwtSecondsToDate(refreshTokenPayload.exp),
      iat: jwtSecondsToDate(refreshTokenPayload.iat),
      deviceId,
      deviceName: meta.deviceName,
      ip: meta.ip,
    }

    await this.sessionsRepository.addSession(session)

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    }
  }

  async confirmEmail(code: string): Promise<Result> {
    const user = await this.usersRepository.findUserByConfirmationCode(code)

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

    const isUpdated = await this.usersRepository.updateConfirmation(user._id)

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
  }

  async emailResending(email: string): Promise<Result> {
    // 1. Проверить, что пользователь с таким email существует
    // 2. Обновить у пользователя confirmation code и сопутствующие поля
    // 3. Отправить новый email
    const user = await this.usersRepository.findByEmail(email)

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

    const isUpdated = await this.usersRepository.updateEmailConfirmation(
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

    this.emailService
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
  }

  async isSessionExist(iat: number, deviceId: string): Promise<boolean> {
    const res = await this.sessionsRepository.findSession(
      jwtSecondsToDate(iat),
      deviceId
    )

    return Boolean(res)
  }

  async createNewTokensAndUpdateSession(
    refreshTokenPayload: RefreshTokenPayload,
    ip: string
  ): Promise<Result<{ accessToken: string; newRefreshToken: string }>> {
    const accessToken = await this.jwtService.createJWT(
      refreshTokenPayload.userId
    )
    const newRefreshToken = await this.jwtService.createRefreshJWT(
      refreshTokenPayload.userId,
      refreshTokenPayload.deviceId
    )

    const newPayload = this.jwtService.decodeToken(newRefreshToken)

    // update session
    const isUpdated = await this.sessionsRepository.updateSession(
      refreshTokenPayload.deviceId,
      jwtSecondsToDate(refreshTokenPayload.iat),
      {
        iat: jwtSecondsToDate(newPayload.iat),
        exp: jwtSecondsToDate(newPayload.exp),
        ip,
      }
    )

    if (!isUpdated) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: '',
        data: null,
        extensions: [],
      }
    }

    return {
      status: ResultStatus.Success,
      data: { accessToken, newRefreshToken },
      extensions: [],
    }
  }

  async logout(refreshTokenPayload: RefreshTokenPayload): Promise<Result> {
    const isSuccessDeleted = await this.sessionsRepository.deleteSession(
      refreshTokenPayload.deviceId,
      jwtSecondsToDate(refreshTokenPayload.iat)
    )

    if (isSuccessDeleted) {
      return {
        status: ResultStatus.Success,
        extensions: [],
        data: null,
      }
    }

    return {
      status: ResultStatus.Unauthorized,
      extensions: [],
      errorMessage: 'Some error',
      data: null,
    }
  }
}
