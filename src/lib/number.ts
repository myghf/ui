/**
 * Normalise a numeric field value: empty and non-finite inputs collapse to
 * `null`, while `0` and every other finite number pass through unchanged.
 */
export function toNumberOrNull(value: number | null | undefined): number | null {
  if (value === null || value === undefined || !Number.isFinite(value)) return null
  return value
}

/**
 * Compose the `Intl.NumberFormatOptions` for a number field. Later sources win,
 * so explicit `formatOptions` override the `currency` shorthand and `integer`
 * forces zero fraction digits regardless of what came before.
 */
export function mergeFormatOptions(input: {
  currency?: string
  formatOptions?: Intl.NumberFormatOptions
  integer?: boolean
}): Intl.NumberFormatOptions {
  return {
    ...(input.currency ? { style: 'currency' as const, currency: input.currency } : {}),
    ...input.formatOptions,
    ...(input.integer ? { maximumFractionDigits: 0 } : {}),
  }
}
