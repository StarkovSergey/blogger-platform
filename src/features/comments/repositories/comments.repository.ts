import { injectable } from 'inversify'
import { CommentDocument, CommentModel } from '../domain/comment.schema.js'

@injectable()
export class CommentsRepository {
  async save(comment: CommentDocument) {
    return comment.save()
  }

  async findById(id: string): Promise<CommentDocument | null> {
    return CommentModel.findById(id)
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await CommentModel.findByIdAndDelete(id)
    return Boolean(deleteResult)
  }
}
