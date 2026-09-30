import { ReactionStatus } from '../../constants/enums.js'

export type CommentViewModel = {
  id: string
  content: string
  commentatorInfo: CommentatorInfo
  createdAt: string
  likesInfo?: LikesInfoViewModel
}

type CommentatorInfo = {
  userId: string
  userLogin: string
}

type LikesInfoViewModel = {
  likesCount: number
  dislikesCount: number
  myStatus: ReactionStatus
}
