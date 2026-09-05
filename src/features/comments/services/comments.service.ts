import { CommentInputModel } from '../types/input/CommentInputModel.js'
import { CommentDB } from '../types/commentDB.js'
import { Result, ResultStatus } from '../../../common/result/result.js'
import { UsersRepository } from '../../users/repositories/users.repository.js'
import { PostsRepository } from '../../posts/repositories/posts.repository.js'
import { CommentsRepository } from '../repositories/comments.repository.js'

export class CommentsService {
  usersRepository: UsersRepository
  postsRepository: PostsRepository
  commentsRepository: CommentsRepository

  constructor(
    usersRepository: UsersRepository,
    postsRepository: PostsRepository,
    commentsRepository: CommentsRepository
  ) {
    this.usersRepository = usersRepository
    this.postsRepository = postsRepository
    this.commentsRepository = commentsRepository
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
