import axe, { type AxeResults, type Result, type RunOptions } from 'axe-core'
import { expect } from 'vitest'

/**
 * Rules that cannot produce a meaningful result inside jsdom:
 *
 * - `color-contrast` needs a layout/paint engine to resolve rendered colours.
 *   jsdom has none, so axe only ever reports it as incomplete. Palette contrast
 *   is asserted separately in `src/lib/contrast.spec.ts`.
 * - `region` expects page-level landmarks, which a bare component fixture is not.
 */
const DISABLED_RULES: NonNullable<RunOptions['rules']> = {
  'color-contrast': { enabled: false },
  region: { enabled: false },
}

type Target = HTMLElement | { element: Element }

function resolveElement(target: Target): HTMLElement {
  const element = (target instanceof HTMLElement ? target : target.element) as HTMLElement
  // axe only scans nodes that live in the document; `mount()` produces a
  // detached root, so attach it to the body before scanning.
  const body = element.ownerDocument?.body
  if (body && !element.isConnected) body.appendChild(element)
  return element
}

/** Runs axe against a mounted component (or a raw element) and returns the violations. */
export async function getA11yViolations(
  target: Target,
  options: RunOptions = {},
): Promise<Result[]> {
  const { rules, ...rest } = options
  const results: AxeResults = await axe.run(resolveElement(target), {
    ...rest,
    rules: { ...DISABLED_RULES, ...rules },
  })
  return results.violations
}

function formatViolations(violations: Result[]): string {
  return violations
    .map((violation) => {
      const targets = violation.nodes.map((node) => node.target.join(' ')).join(', ')
      return `- [${violation.impact ?? 'unknown'}] ${violation.id}: ${violation.help} (${targets})`
    })
    .join('\n')
}

/** Asserts that a mounted component (or raw element) has no axe violations. */
export async function expectNoA11yViolations(
  target: Target,
  options: RunOptions = {},
): Promise<void> {
  const violations = await getA11yViolations(target, options)
  expect(
    violations.length === 0,
    `Expected no accessibility violations, found ${violations.length}:\n${formatViolations(violations)}`,
  ).toBe(true)
}
