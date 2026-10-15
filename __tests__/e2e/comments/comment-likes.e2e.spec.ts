import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import express from 'express'
import { setupApp } from '../../../src/setup-app.js'
import { clearDb } from '../../utils/clear-db.js'
import { blogsTestClient } from '../../utils/test-clients/blogs-test-client.js'
import {
  createValidPostInput,
  postsTestClient,
} from '../../utils/test-clients/posts-test-client.js'
import {
  createValidUserInput,
  usersTestClient,
  VALID_USER_INPUT,
} from '../../utils/test-clients/users-test-client.js'
import { authTestClient } from '../../utils/test-clients/auth-test-client.js'
import { commentsTestClient } from '../../utils/test-clients/comments-test-client.js'
import { runDB, stopDb } from '../../../src/db/mongo.db.js'
import { SETTINGS } from '../../../src/settings/config.js'
import { HttpStatus } from '../../../src/common/constants/constants.js'
import { ReactionStatus } from '../../../src/features/comments/constants/enums.js'
import { PATHS } from '../../../src/core/paths/paths.js'
import request from 'supertest'

describe('Comment likes API', () => {
  const app = express()
  setupApp(app)

  let postId: string
  let commentId: string
  let accessToken: string

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL_TEST)
  })

  beforeEach(async () => {
    await clearDb(app)

    const blog = await blogsTestClient.createBlog(app)
    const post = await postsTestClient.createPost(
      app,
      createValidPostInput(blog.id)
    )
    postId = post.id

    await usersTestClient.createUser(app, VALID_USER_INPUT)
    const loginResponse = await authTestClient.login(app, {
      loginOrEmail: VALID_USER_INPUT.login,
      password: VALID_USER_INPUT.password,
    })
    accessToken = loginResponse.body.accessToken

    const comment = await commentsTestClient.createComment(
      app,
      postId,
      accessToken
    )
    commentId = comment.id
  })

  afterAll(async () => {
    await stopDb()
  })

  it('should return 401 when like without auth', async () => {
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      null,
      ReactionStatus.Like,
      HttpStatus.UNAUTHORIZED_401
    )
  })

  it('should return 404 when liking non-existent comment', async () => {
    const fakeId = '507f1f77bcf86cd799439011'

    await commentsTestClient.updateLikeStatus(
      app,
      fakeId,
      accessToken,
      ReactionStatus.Like,
      HttpStatus.NOT_FOUND_404
    )
  })

  it('should return 400 for invalid likeStatus', async () => {
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      accessToken,
      'invalid',
      HttpStatus.BAD_REQUEST_400
    )
  })

  it('should return zero likesInfo for a new comment', async () => {
    const comment = await commentsTestClient.getComment(
      app,
      commentId,
      accessToken
    )

    expect(comment.likesInfo).toEqual({
      likesCount: 0,
      dislikesCount: 0,
      myStatus: ReactionStatus.None,
    })
  })

  it('should set like and return updated likesInfo', async () => {
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      accessToken,
      ReactionStatus.Like
    )

    const comment = await commentsTestClient.getComment(
      app,
      commentId,
      accessToken
    )

    expect(comment.likesInfo).toEqual({
      likesCount: 1,
      dislikesCount: 0,
      myStatus: ReactionStatus.Like,
    })
  })

  it('should return myStatus none for guest after like', async () => {
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      accessToken,
      ReactionStatus.Like
    )

    const comment = await commentsTestClient.getComment(app, commentId)

    expect(comment.likesInfo).toEqual({
      likesCount: 1,
      dislikesCount: 0,
      myStatus: ReactionStatus.None,
    })
  })

  it('should change like to dislike', async () => {
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      accessToken,
      ReactionStatus.Like
    )
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      accessToken,
      ReactionStatus.Dislike
    )

    const comment = await commentsTestClient.getComment(
      app,
      commentId,
      accessToken
    )

    expect(comment.likesInfo).toEqual({
      likesCount: 0,
      dislikesCount: 1,
      myStatus: ReactionStatus.Dislike,
    })
  })

  it('should change dislike to none', async () => {
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      accessToken,
      ReactionStatus.Dislike
    )
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      accessToken,
      ReactionStatus.None
    )

    const comment = await commentsTestClient.getComment(
      app,
      commentId,
      accessToken
    )

    expect(comment.likesInfo).toEqual({
      likesCount: 0,
      dislikesCount: 0,
      myStatus: ReactionStatus.None,
    })
  })

  it('should not change counters when setting the same status again', async () => {
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      accessToken,
      ReactionStatus.Like
    )
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      accessToken,
      ReactionStatus.Like
    )

    const comment = await commentsTestClient.getComment(
      app,
      commentId,
      accessToken
    )

    expect(comment.likesInfo).toEqual({
      likesCount: 1,
      dislikesCount: 0,
      myStatus: ReactionStatus.Like,
    })
  })

  it('should keep independent myStatus for two users', async () => {
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      accessToken,
      ReactionStatus.Like
    )

    const secondUser = createValidUserInput({
      login: 'user_2',
      email: 'user2@example.com',
    })
    await usersTestClient.createUser(app, secondUser)
    const secondLogin = await authTestClient.login(app, {
      loginOrEmail: secondUser.login,
      password: secondUser.password,
    })
    const secondToken = secondLogin.body.accessToken

    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      secondToken,
      ReactionStatus.Like
    )

    const forFirst = await commentsTestClient.getComment(
      app,
      commentId,
      accessToken
    )
    const forSecond = await commentsTestClient.getComment(
      app,
      commentId,
      secondToken
    )

    expect(forFirst.likesInfo).toEqual({
      likesCount: 2,
      dislikesCount: 0,
      myStatus: ReactionStatus.Like,
    })
    expect(forSecond.likesInfo).toEqual({
      likesCount: 2,
      dislikesCount: 0,
      myStatus: ReactionStatus.Like,
    })
  })

  it('should return myStatus in post comments list for authorized user', async () => {
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      accessToken,
      ReactionStatus.Like
    )

    const list = await commentsTestClient.getPostComments(
      app,
      postId,
      accessToken
    )

    expect(list.items).toHaveLength(1)
    expect(list.items[0].likesInfo).toEqual({
      likesCount: 1,
      dislikesCount: 0,
      myStatus: ReactionStatus.Like,
    })
  })

  it('should return myStatus none in post comments list for guest', async () => {
    await commentsTestClient.updateLikeStatus(
      app,
      commentId,
      accessToken,
      ReactionStatus.Like
    )

    const list = await commentsTestClient.getPostComments(app, postId)

    expect(list.items[0].likesInfo).toEqual({
      likesCount: 1,
      dislikesCount: 0,
      myStatus: ReactionStatus.None,
    })
  })

  it('should return 404 for invalid comment id format on like-status', async () => {
    await request(app)
      .put(`${PATHS.comments}/not-an-object-id/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ likeStatus: ReactionStatus.Like })
      .expect(HttpStatus.BAD_REQUEST_400)
  })
})
