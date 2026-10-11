/**
 * Shared Tailwind class maps for the layout primitives.
 *
 * The classes are written as literals (not built by interpolation) so Tailwind
 * can find and generate them when it scans this package.
 */
export type LayoutGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type LayoutAlign = 'start' | 'center' | 'end' | 'stretch'
export type LayoutJustify = 'start' | 'center' | 'end' | 'between'
export type LayoutCols = 1 | 2 | 3 | 4 | 5 | 6 | 12

export const GAP_CLASSES: Record<LayoutGap, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

export const ALIGN_CLASSES: Record<LayoutAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

export const JUSTIFY_CLASSES: Record<LayoutJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

export const COLS_CLASSES: Record<LayoutCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
}
