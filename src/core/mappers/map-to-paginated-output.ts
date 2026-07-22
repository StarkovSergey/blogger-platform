import { PaginatedOutput } from '../types/paginated-output.js'

export function mapToPaginatedOutput<TItem, TData = TItem>(
  items: TItem[],
  meta: {
    pageNumber: number
    pageSize: number
    totalCount: number
  },
  mapItem?: (item: TItem) => TData
): { items: TData[] } & PaginatedOutput {
  return {
    items: mapItem ? items.map(mapItem) : (items as unknown as TData[]),

    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
  }
}
