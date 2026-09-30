import { CommentInputModel } from '../types/input/CommentInputModel.js'
import { injectable } from 'inversify'
import {
  CommentDB,
  CommentDocument,
  commentModel,
} from '../domain/comment.schema.js'

@injectable()
export class CommentsRepository {
  async save(comment: CommentDocument) {
    return comment.save()
  }

  async findById(id: string) {
    return commentModel.findById(id)
  }

  async create(comment: CommentDB): Promise<string> {
    const result = await commentModel.create(comment)

    return result._id.toString()
  }

  async update(id: string, dto: CommentInputModel): Promise<boolean> {
    const updatedResult = await commentModel.findByIdAndUpdate(id, dto)

    return Boolean(updatedResult)
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await commentModel.findByIdAndDelete(id)
    return Boolean(deleteResult)
  }
}
