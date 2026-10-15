import { LoginInputModel } from '../types/input/login-input-model.js'
import {
  jwtSecondsToDate,
  JwtService,
  RefreshTokenPayload,
} from '../../../core/adapters/jwt.service.js'
import { Result, ResultStatus } from '../../../common/result/result.js'
import { LoginSuccessViewModel } from '../types/output/LoginSuccessViewModel.js'
import { RegistrationInputModel } from '../types/input/registration-input-model.js'
import { emailManager } from '../../../core/constants/managers/email-manager.js'
import { SessionsRepository } from '../repositories/sessions.repository.js'
import { UsersRepository } from '../../users/repositories/users.repository.js'
import { EmailService } from '../../../core/adapters/email.service.js'
import { PasswordHashService } from '../../../core/adapters/password-hash.service.js'
import { NewPasswordRecoveryInputModel } from '../types/input/new-password-recovery-input-model.js'
import { inject, injectable } from 'inversify'
import { SessionDB, SessionModel } from '../domain/session.schema.js'
import { UserModel } from '../../users/domain/user.schema.js'

@injectable()
export class AuthService {
  private sessionsRepository: SessionsRepository
  private usersRepository: UsersRepository
  private emailService: EmailService
  private jwtService: JwtService
  private passwordHashService: PasswordHashService

  constructor(
    @inject(SessionsRepository) sessionsRepository: SessionsRepository,
    @inject(UsersRepository) usersRepository: UsersRepository,
    @inject(EmailService) emailService: EmailService,
    @inject(JwtService) jwtService: JwtService,
    @inject(PasswordHashService) passwordHashService: PasswordHashService
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
    const newUser = UserModel.createUser({
      login,
      email,
      passwordHash,
      isConfirmed: false,
    })

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

    const session = SessionModel.createSession({
      userId,
      deviceId,
      deviceName: meta.deviceName,
      ip: meta.ip,
      iat: jwtSecondsToDate(refreshTokenPayload.iat),
      exp: jwtSecondsToDate(refreshTokenPayload.exp),
    })
    await this.sessionsRepository.save(session)

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    }
  }

  async confirmEmail(code: string): Promise<Result> {
    const user = await this.usersRepository.findUserByConfirmationCode(code)

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'code', message: 'Incorrect confirmation code' }],
        data: null,
      }
    }

    const ok = user.updateConfirmation(code)

    if (!ok) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'code', message: 'Incorrect confirmation code' }],
        data: null,
      }
    }

    await this.usersRepository.save(user)

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

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'email', message: 'Email already confirmed or not found' },
        ],
      }
    }

    const ok = user.resendEmailConfirmation()

    if (!ok) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'email', message: 'Email already confirmed or not found' },
        ],
      }
    }

    await this.usersRepository.save(user)

    this.emailService
      .sendEmail({
        to: user.email,
        subject: emailManager.registration.subject,
        text: emailManager.registration.email(
          user.emailConfirmation.confirmationCode
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
    const session = await this.sessionsRepository.findSession(
      jwtSecondsToDate(refreshTokenPayload.iat),
      refreshTokenPayload.deviceId
    )

    if (!session) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: '',
        data: null,
        extensions: [],
      }
    }

    const accessToken = await this.jwtService.createJWT(
      refreshTokenPayload.userId
    )
    const newRefreshToken = await this.jwtService.createRefreshJWT(
      refreshTokenPayload.userId,
      refreshTokenPayload.deviceId
    )

    const newPayload = this.jwtService.decodeToken(newRefreshToken)

    // update session
    session.updateOnRefresh({
      iat: jwtSecondsToDate(newPayload.iat),
      exp: jwtSecondsToDate(newPayload.exp),
      ip,
    })
    await this.sessionsRepository.save(session)

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

  async passwordRecovery(email: string): Promise<Result> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return {
        status: ResultStatus.Success, // всё-равно 204; не светим, есть ли такой пользователь
        data: null,
        extensions: [],
      }
    }

    const recoveryCode = user.requestPasswordRecovery()
    await this.usersRepository.save(user)

    this.emailService
      .sendEmail({
        to: user.email,
        subject: emailManager.passwordRecovery.subject,
        text: emailManager.passwordRecovery.email(recoveryCode),
      })
      .catch((err) => {
        // тут можно сделать либо retry, либо rollback
        console.error('error in sending email:', err)
      })

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  }

  async updatePassword(dto: NewPasswordRecoveryInputModel): Promise<Result> {
    const user = await this.usersRepository.findByRecoveryCode(dto.recoveryCode)

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [
          { field: 'recoveryCode', message: 'Incorrect recovery code' },
        ],
      }
    }

    const newPasswordHash = await this.passwordHashService.generateHash(
      dto.newPassword
    )

    const ok = user.updatePassword(dto.recoveryCode, newPasswordHash)

    if (!ok) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [],
      }
    }

    await this.usersRepository.save(user)

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  }
}
