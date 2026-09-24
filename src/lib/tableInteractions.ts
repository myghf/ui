/** Structural type so the guard is unit-testable in node env (no DOM). */
export interface ClosestHost {
  closest: (selector: string) => unknown
}

const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  'label',
  '[role="checkbox"]',
  '[role="switch"]',
  '[role="combobox"]',
  '[role="menu"]',
  '[data-row-toggle-ignore]',
].join(',')

/**
 * Replaces the app's `closest('.p-select, .p-button, ...')` guard: any click
 * landing inside a real interactive element (or an element opted out with
 * `data-row-toggle-ignore`) never toggles the row.
 *
 * The parameter is `unknown` on purpose — DOM `EventTarget` has no `closest`,
 * and callers pass `event.target` straight through.
 */
export function shouldIgnoreRowToggle(target: unknown): boolean {
  const host = target as ClosestHost | null | undefined
  if (!host || typeof host.closest !== 'function') return false
  return host.closest(INTERACTIVE_SELECTOR) !== null
}

/** Single-row expansion map, keyed by row id, as used by `v-model:expanded`. */
export function toggleExpandedRow(
  expanded: Record<string, boolean>,
  rowId: string,
): Record<string, boolean> {
  return expanded[rowId] ? {} : { [rowId]: true }
}
