export interface PageRange {
  /** 1-based index of the first visible row, 0 when there is no row. */
  from: number
  /** 1-based index of the last visible row, 0 when there is no row. */
  to: number
  total: number
}

export function pageRange(pageIndex: number, pageSize: number, total: number): PageRange {
  if (total <= 0 || pageSize <= 0) return { from: 0, to: 0, total: Math.max(0, total) }
  const from = pageIndex * pageSize + 1
  const to = Math.min(total, from + pageSize - 1)
  return from > total ? { from: 0, to: 0, total } : { from, to, total }
}

export function totalPages(total: number, pageSize: number): number {
  if (pageSize <= 0) return 1
  return Math.max(1, Math.ceil(total / pageSize))
}

/** 1-based page numbers, clamped to the window and to the bounds. */
export function pageWindow(pageIndex: number, pageCount: number, size = 5): number[] {
  if (pageCount <= 0) return []
  const half = Math.floor(size / 2)
  const start = Math.max(0, Math.min(pageIndex - half, pageCount - size))
  const from = Math.max(0, start)
  return Array.from({ length: Math.min(size, pageCount - from) }, (_, i) => from + i + 1)
}
