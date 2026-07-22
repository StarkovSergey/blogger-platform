export type PaginatedOutput = {
  page: number
  pageSize: number
  pagesCount: number
  totalCount: number
}

export type Pagination<T> = {
  items: T[]
} & PaginatedOutput
