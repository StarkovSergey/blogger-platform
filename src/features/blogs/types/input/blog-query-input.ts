import { PaginationAndSorting } from '../../../../core/types/pagination-and-sorting.js'
import { BlogSortField } from './blog-sort-field.js'

export type BlogQueryInput = PaginationAndSorting<BlogSortField> & {
  searchNameTerm?: string
}
