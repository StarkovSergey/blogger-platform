import 'reflect-metadata'
import { Container } from 'inversify'

import { SessionsRepository } from './features/auth/repositories/sessions.repository.js'
import { SessionsQueryRepository } from './features/auth/repositories/sessions.query.repository.js'
import { AuthService } from './features/auth/services/auth.service.js'
import { BlogsQueryRepository } from './features/blogs/repositories/blogs.query.repository.js'
import { BlogsRepository } from './features/blogs/repositories/blogs.repository.js'
import { PostsRepository } from './features/posts/repositories/posts.repository.js'
import { PostsQueryRepository } from './features/posts/repositories/posts.query.repository.js'
import { UsersRepository } from './features/users/repositories/users.repository.js'
import { UsersQueryRepository } from './features/users/repositories/users.query.repository.js'
import { CommentsQueryRepository } from './features/comments/repositories/comments.query.repository.js'
import { CommentsRepository } from './features/comments/repositories/comments.repository.js'
import { AuthQueryService } from './features/auth/services/auth.query.service.js'
import { BlogsService } from './features/blogs/services/blogs.service.js'
import { CommentsService } from './features/comments/services/comments.service.js'
import { PostsService } from './features/posts/services/posts.service.js'
import { SecurityService } from './features/security/services/security.service.js'
import { EmailService } from './core/adapters/email.service.js'
import { JwtService } from './core/adapters/jwt.service.js'
import { PasswordHashService } from './core/adapters/password-hash.service.js'
import { UsersService } from './features/users/services/users.service.js'

export const container = new Container({
  defaultScope: 'Singleton',
})

container.bind(SessionsRepository).toSelf()
container.bind(SessionsQueryRepository).toSelf()

container.bind(BlogsRepository).toSelf()
container.bind(BlogsQueryRepository).toSelf()
container.bind(PostsRepository).toSelf()
container.bind(PostsQueryRepository).toSelf()
container.bind(CommentsRepository).toSelf()
container.bind(CommentsQueryRepository).toSelf()

container.bind(UsersRepository).toSelf()
container.bind(UsersQueryRepository).toSelf()
container.bind(EmailService).toSelf()
container.bind(JwtService).toSelf()
container.bind(PasswordHashService).toSelf()
container.bind(AuthService).toSelf()
container.bind(AuthQueryService).toSelf()
container.bind(UsersService).toSelf()

container.bind(BlogsService).toSelf()
container.bind(PostsService).toSelf()
container.bind(CommentsService).toSelf()
container.bind(SecurityService).toSelf()

// repositories
export const sessionsRepository = container.get(SessionsRepository)
export const sessionsQueryRepository = container.get(SessionsQueryRepository)

export const blogsRepository = container.get(BlogsRepository)
export const blogsQueryRepository = container.get(BlogsQueryRepository)

export const postsRepository = container.get(PostsRepository)
export const postsQueryRepository = container.get(PostsQueryRepository)

export const commentsQueryRepository = container.get(CommentsQueryRepository)
export const commentsRepository = container.get(CommentsRepository)

export const usersRepository = container.get(UsersRepository)
export const usersQueryRepository = container.get(UsersQueryRepository)

// helper services
export const emailService = container.get(EmailService)
export const jwtService = container.get(JwtService)
export const passwordHashService = container.get(PasswordHashService)

// services
export const authService = container.get(AuthService)
export const authQueryService = container.get(AuthQueryService)

export const usersService = container.get(UsersService)

export const blogsService = container.get(BlogsService)
export const postsService = container.get(PostsService)
export const commentsService = container.get(CommentsService)

export const securityService = container.get(SecurityService)
