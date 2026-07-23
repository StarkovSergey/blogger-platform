import { Pagination } from '../../../core/types/paginated-output.js'
import { UserViewModel } from '../types/output/UserViewModel.js'
import { UserQueryInput } from '../types/input/user-query-input.js'
import { escapeRegExp } from '../../../common/helpers/escape-reg-exp.js'
import { usersCollection } from '../../../db/collections.js'
import { ObjectId, WithId } from 'mongodb'
import { UserDB } from '../types/userDB.js'
import { NotFoundException } from '../../../core/exeptions/not-found.exception.js'

export const usersQueryRepository = {
  async findMany(queryDto: UserQueryInput): Promise<Pagination<UserViewModel>> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = queryDto

    const skip = (pageNumber - 1) * pageSize
    const filter: any = {}

    if (searchLoginTerm || searchEmailTerm) {
      filter.$or = []

      if (searchLoginTerm) {
        filter.$or.push({
          login: { $regex: escapeRegExp(searchLoginTerm), $options: 'i' },
        })
      }

      if (searchEmailTerm) {
        filter.$or.push({
          email: { $regex: escapeRegExp(searchEmailTerm), $options: 'i' },
        })
      }
    }

    const [items, totalCount] = await Promise.all([
      usersCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      usersCollection.countDocuments(filter),
    ])

    return {
      items: items.map(this._mapToUserListViewModel),
      totalCount,
      pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
    }
  },
  async findByIdOrFail(id: string): Promise<UserViewModel> {
    const res = await usersCollection.findOne({ _id: new ObjectId(id) })

    if (!res) {
      throw new NotFoundException('User not found')
    }

    return this._mapToUserListViewModel(res)
  },
  _mapToUserListViewModel(user: WithId<UserDB>): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    }
  },
}
