import { scaleBand, scaleLinear } from 'd3-scale'
import { area, line, curveMonotoneX } from 'd3-shape'

export interface ChartSize {
  width: number
  height: number
  /** Inset from every edge so strokes are not clipped. */
  padding?: number
}

export interface BarRect {
  x: number
  y: number
  width: number
  height: number
}

function scales(values: number[], { width, height, padding = 2 }: ChartSize) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  return {
    x: scaleLinear()
      .domain([0, Math.max(1, values.length - 1)])
      .range([padding, width - padding]),
    y: scaleLinear()
      .domain([min, max === min ? min + 1 : max])
      .range([height - padding, padding]),
    padding,
  }
}

/** SVG path for a line through `values`. Empty string when there is no data. */
export function linePath(values: number[], size: ChartSize): string {
  if (values.length === 0) return ''
  const { x, y } = scales(values, size)
  return (
    line<number>()
      .x((_, index) => x(index))
      .y((value) => y(value))
      .curve(curveMonotoneX)(values) ?? ''
  )
}

/** SVG path for an area under the line through `values`. Empty string when there is no data. */
export function areaPath(values: number[], size: ChartSize): string {
  if (values.length === 0) return ''
  const { x, y, padding } = scales(values, size)
  return (
    area<number>()
      .x((_, index) => x(index))
      .y0(size.height - padding)
      .y1((value) => y(value))
      .curve(curveMonotoneX)(values) ?? ''
  )
}

/** Rectangles for a categorical bar chart, one per value. */
export function barRects(values: number[], size: ChartSize): BarRect[] {
  if (values.length === 0) return []
  const { padding } = scales(values, size)
  const max = Math.max(...values, 0) || 1
  const x = scaleBand<number>()
    .domain(values.map((_, index) => index))
    .range([padding, size.width - padding])
    .paddingInner(0.2)
    .paddingOuter(0)
  const y = scaleLinear()
    .domain([0, max])
    .range([size.height - padding, padding])

  return values.map((value, index) => {
    const top = y(value)
    return {
      x: x(index) ?? padding,
      y: top,
      width: x.bandwidth(),
      height: Math.max(0, size.height - padding - top),
    }
  })
}
