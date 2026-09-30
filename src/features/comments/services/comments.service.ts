import { CommentInputModel } from '../types/input/CommentInputModel.js'
import { Result, ResultStatus } from '../../../common/result/result.js'
import { UsersRepository } from '../../users/repositories/users.repository.js'
import { PostsRepository } from '../../posts/repositories/posts.repository.js'
import { CommentsRepository } from '../repositories/comments.repository.js'
import { inject, injectable } from 'inversify'
import { CommentDB } from '../domain/comment.schema.js'
import { LikeInputModel } from '../types/input/LikeInputModel.js'
import { CommentsLikeRepository } from '../repositories/comments-like.repository.js'
import { ReactionStatus } from '../constants/enums.js'

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

    const comment: CommentDB = {
      postId,
      content: dto.content,
      createdAt: new Date(),
      commentatorInfo: {
        userId,
        userLogin: user.login,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    }

    const commentId = await this.commentsRepository.create(comment)

    return {
      status: ResultStatus.Success,
      data: commentId,
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
    const canModifyResult = await this._ensureUserCanModifyComment(id, userId)

    if (canModifyResult.status !== ResultStatus.Success) {
      return canModifyResult
    }

    const isSuccessUpdate = await this.commentsRepository.update(id, dto)

    if (!isSuccessUpdate) {
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

  async delete(id: string, userId: string): Promise<Result<null>> {
    const canModifyResult = await this._ensureUserCanModifyComment(id, userId)

    if (canModifyResult.status !== ResultStatus.Success) {
      return canModifyResult
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

    /**
     * Нужно обновить commentsLike collection и comment likeInfo
     * */
    const existingCommentLike =
      await this.commentsLikeRepository.findByUserIdAndCommentId(userId, id)

    const prev = existingCommentLike?.status ?? ReactionStatus.None
    const next = dto.likeStatus

    // тот же статус — ничего не делаем
    if (prev === next) {
      return {
        status: ResultStatus.Success,
        data: null,
        extensions: [],
      }
    }

    // 1) откатить предыдущую реакцию
    if (prev === ReactionStatus.Like && next !== ReactionStatus.Like) {
      comment.likesInfo.likesCount--
    }

    if (prev === ReactionStatus.Dislike && next !== ReactionStatus.Dislike) {
      comment.likesInfo.dislikesCount--
    }

    // 2) применить новую
    if (next === ReactionStatus.Like) {
      comment.likesInfo.likesCount++
    }

    if (next === ReactionStatus.Dislike) {
      comment.likesInfo.dislikesCount++
    }

    // 3) синхронизировать коллекцию реакций
    if (!existingCommentLike) {
      await this.commentsLikeRepository.create({
        status: next,
        commentId: id,
        userId,
      })
    } else {
      existingCommentLike.status = next
      await this.commentsLikeRepository.save(existingCommentLike)
    }
    // 4) сохранить счётчики на комментарии
    await this.commentsRepository.save(comment)

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  }

  async _ensureUserCanModifyComment(
    id: string,
    userId: string
  ): Promise<Result<null>> {
    const comment = await this.commentsRepository.findById(id)

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Comment not found',
        extensions: [],
        data: null,
      }
    }

    if (userId !== comment.commentatorInfo.userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: 'Forbidden',
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
}
