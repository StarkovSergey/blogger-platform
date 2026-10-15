import { CommentInputModel } from '../types/input/CommentInputModel.js'
import { Result, ResultStatus } from '../../../common/result/result.js'
import { UsersRepository } from '../../users/repositories/users.repository.js'
import { PostsRepository } from '../../posts/repositories/posts.repository.js'
import { CommentsRepository } from '../repositories/comments.repository.js'
import { inject, injectable } from 'inversify'
import { CommentModel } from '../domain/comment.schema.js'
import { LikeInputModel } from '../types/input/LikeInputModel.js'
import { CommentsLikeRepository } from '../repositories/comments-like.repository.js'
import { ReactionStatus } from '../constants/enums.js'
import { CommentLikeModel } from '../domain/comment-like.schema.js'

@injectable()
export class CommentsService {
  private usersRepository: UsersRepository
  private postsRepository: PostsRepository
  private commentsRepository: CommentsRepository
  private commentsLikeRepository: CommentsLikeRepository

  constructor(
    @inject(UsersRepository) usersRepository: UsersRepository,
    @inject(PostsRepository) postsRepository: PostsRepository,
    @inject(CommentsRepository) commentsRepository: CommentsRepository,
    @inject(CommentsLikeRepository)
    commentsLikeRepository: CommentsLikeRepository
  ) {
    this.usersRepository = usersRepository
    this.postsRepository = postsRepository
    this.commentsRepository = commentsRepository
    this.commentsLikeRepository = commentsLikeRepository
  }

  async create({
    userId,
    postId,
    dto,
  }: {
    dto: CommentInputModel
    userId: string
    postId: string
  }): Promise<Result<string>> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return {
        data: null,
        errorMessage: 'User not found',
        extensions: [],
        status: ResultStatus.NotFound,
      }
    }

    const post = await this.postsRepository.findById(postId)

    if (!post) {
      return {
        data: null,
        errorMessage: 'Post not found',
        extensions: [],
        status: ResultStatus.NotFound,
      }
    }

    const comment = CommentModel.createComment({
      content: dto.content,
      postId,
      userId,
      userLogin: user.login,
    })

    const saved = await this.commentsRepository.save(comment)

    return {
      status: ResultStatus.Success,
      data: saved._id.toString(),
      extensions: [],
    }
  }

  async update({
    id,
    userId,
    dto,
  }: {
    id: string
    userId: string
    dto: CommentInputModel
  }): Promise<Result<null>> {
    const comment = await this.commentsRepository.findById(id)

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Comment not found',
        extensions: [],
        data: null,
      }
    }

    if (!comment.belongsToUser(userId)) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: 'Forbidden',
        extensions: [],
        data: null,
      }
    }

    comment.updateContent(dto.content)
    await this.commentsRepository.save(comment)

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  }

  async delete(id: string, userId: string): Promise<Result<null>> {
    const comment = await this.commentsRepository.findById(id)

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Comment not found',
        extensions: [],
        data: null,
      }
    }

    if (!comment.belongsToUser(userId)) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: 'Forbidden',
        extensions: [],
        data: null,
      }
    }

    const isSuccessDelete = await this.commentsRepository.delete(id)

    if (!isSuccessDelete) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Comment not found',
        extensions: [],
        data: null,
      }
    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  }

  async updateLikeStatus(id: string, userId: string, dto: LikeInputModel) {
    const comment = await this.commentsRepository.findById(id)

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Comment not found',
        extensions: [],
        data: null,
      }
    }

    const existingCommentLike =
      await this.commentsLikeRepository.findByUserIdAndCommentId(userId, id)

    const prev = existingCommentLike?.status ?? ReactionStatus.None
    const next = dto.likeStatus

    if (prev === next) {
      return {
        status: ResultStatus.Success,
        data: null,
        extensions: [],
      }
    }

    comment.applyLikeChange(prev, next)

    if (!existingCommentLike) {
      const commentLike = CommentLikeModel.createLike({
        status: next,
        commentId: id,
        userId,
      })
      await this.commentsLikeRepository.save(commentLike)
    } else {
      existingCommentLike.changeStatus(next)
      await this.commentsLikeRepository.save(existingCommentLike)
    }

    await this.commentsRepository.save(comment)

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  }
}
