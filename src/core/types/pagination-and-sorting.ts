import { SortDirection } from './sort-direction.js'

export type PaginationAndSorting<S> = {
  pageNumber: number
  pageSize: number
  sortBy: S
  sortDirection: SortDirection
}
