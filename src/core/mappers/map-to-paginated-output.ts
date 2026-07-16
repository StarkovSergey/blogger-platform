import { PaginatedOutput } from '../types/paginated-output.js'

export function mapToPaginatedOutput<TItem, TData>(
  items: TItem[],
  meta: {
    pageNumber: number
    pageSize: number
    totalCount: number
  },
  mapItem: (item: TItem) => TData
): { items: TData[] } & PaginatedOutput {
  return {
    items: items.map(mapItem),

    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
  }
}
