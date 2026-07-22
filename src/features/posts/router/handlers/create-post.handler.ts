import type {
  ApiResponse,
  RequestWithBody,
} from '../../../../core/types/utils-types.js'
import { PostInputModel } from '../../types/input/PostInputModel.js'
import { PostViewModel } from '../../types/output/PostViewModel.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { postsService } from '../../application/posts.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'
import { postsQueryRepository } from '../../repositories/posts.query.repository.js'

export const createPostHandler = async (
  req: RequestWithBody<PostInputModel>,
  res: ApiResponse<PostViewModel>
) => {
  try {
    const createdPostId = await postsService.createPost(req.body)

    const postViewModel =
      await postsQueryRepository.findByIdOrFailed(createdPostId)

    res.status(HttpStatus.CREATED_201).json(postViewModel)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
