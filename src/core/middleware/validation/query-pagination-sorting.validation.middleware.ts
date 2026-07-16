import { SortDirection } from '../../types/sort-direction.js'
import { query } from 'express-validator'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_SORT_DIRECTION = SortDirection.Desc

export function paginationAndSortingValidation(
  sortFieldsEnum: Record<string, string>
) {
  const allowedSortFields = Object.values(sortFieldsEnum)

  return [
    query('pageNumber')
      .default(DEFAULT_PAGE)
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer')
      .toInt(),

    query('pageSize')
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100')
      .toInt(),

    query('sortBy')
      .default(Object.values(sortFieldsEnum)[0]) // Первое значение enum как дефолтное
      .isIn(allowedSortFields)
      .withMessage(
        `Invalid sort field. Allowed values: ${allowedSortFields.join(', ')}`
      ),

    query('sortDirection')
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(
        `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`
      ),
  ]
}
