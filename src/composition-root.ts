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

// repositories
export const sessionsRepository = new SessionsRepository()
export const sessionsQueryRepository = new SessionsQueryRepository()

export const blogsRepository = new BlogsRepository()
export const blogsQueryRepository = new BlogsQueryRepository()

export const postsRepository = new PostsRepository()
export const postsQueryRepository = new PostsQueryRepository()

export const commentsQueryRepository = new CommentsQueryRepository()
export const commentsRepository = new CommentsRepository()

export const usersRepository = new UsersRepository()
export const usersQueryRepository = new UsersQueryRepository()

// helper services
export const emailService = new EmailService()
export const jwtService = new JwtService()
export const passwordHashService = new PasswordHashService()

// services
export const authService = new AuthService(
  sessionsRepository,
  usersRepository,
  emailService,
  jwtService,
  passwordHashService
)
export const authQueryService = new AuthQueryService(usersQueryRepository)

export const usersService = new UsersService(
  usersRepository,
  passwordHashService
)

export const blogsService = new BlogsService(blogsRepository, postsRepository)
export const postsService = new PostsService(postsRepository, blogsRepository)
export const commentsService = new CommentsService(
  usersRepository,
  postsRepository,
  commentsRepository
)

export const securityService = new SecurityService(
  sessionsRepository,
  sessionsQueryRepository
)
