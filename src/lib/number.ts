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

/** Formats a number for a locale (BCP-47), falling back to `String(value)` on a bad locale. */
export function formatNumber(
  value: number,
  locale?: string,
  options?: Intl.NumberFormatOptions,
): string {
  try {
    return new Intl.NumberFormat(locale, options).format(value)
  } catch {
    return String(value)
  }
}

/** Formats a number as currency for a locale, e.g. `formatCurrency(1234.5, 'EGP', 'ar-EG')`. */
export function formatCurrency(
  value: number,
  currency: string,
  locale?: string,
  options?: Intl.NumberFormatOptions,
): string {
  return formatNumber(value, locale, { style: 'currency', currency, ...options })
}

/** Formats a ratio as a percentage, e.g. `formatPercent(0.25)` → `'25%'`. */
export function formatPercent(
  value: number,
  locale?: string,
  options?: Intl.NumberFormatOptions,
): string {
  return formatNumber(value, locale, { style: 'percent', ...options })
}
