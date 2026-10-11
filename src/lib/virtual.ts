export interface VirtualWindow {
  /** First row index to render (inclusive). */
  start: number
  /** Last row index to render (exclusive). */
  end: number
  /** Height of the spacer row above the window. */
  paddingTop: number
  /** Height of the spacer row below the window. */
  paddingBottom: number
}

/**
 * Computes the visible row window for a uniformly-sized list. Pure, so it is
 * unit-testable without a DOM; the table renders spacer rows from the padding.
 */
export function virtualWindow(
  count: number,
  rowHeight: number,
  scrollTop: number,
  viewportHeight: number,
  overscan = 4,
): VirtualWindow {
  const height = rowHeight > 0 ? rowHeight : 1
  const total = Math.max(0, Math.floor(count))
  const clamp = (value: number) => Math.min(total, Math.max(0, value))

  const start = clamp(Math.floor(Math.max(0, scrollTop) / height) - overscan)
  const end = clamp(Math.ceil((Math.max(0, scrollTop) + Math.max(0, viewportHeight)) / height) + overscan)

  return {
    start,
    end: Math.max(start, end),
    paddingTop: start * height,
    paddingBottom: (total - Math.max(start, end)) * height,
  }
}
