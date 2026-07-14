import type {
  ApiResponse,
  RequestWithBody,
} from '../../../../common/types/utils-types.js'
import { PostInputModel } from '../../models/PostInputModel.js'
import { PostViewModel } from '../../models/PostViewModel.js'
import { HttpStatus } from '../../../../common/constants/constants.js'
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.js'
import { postsService } from '../../application/posts.service.js'
import { errorsHandlers } from '../../../../core/exeptions/errors-handlers.js'

export const createPostHandler = async (
  req: RequestWithBody<PostInputModel>,
  res: ApiResponse<PostViewModel>
) => {
  try {
    const createdPost = await postsService.createPost(req.body)

    const postViewModel = mapToPostViewModel(createdPost)

    res.status(HttpStatus.CREATED_201).json(postViewModel)
  } catch (e) {
    errorsHandlers(e, res)
  }
}
