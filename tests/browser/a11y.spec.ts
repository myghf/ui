import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const VARIANTS = [
  { name: 'light / ltr', dir: 'ltr', theme: 'light' },
  { name: 'light / rtl', dir: 'rtl', theme: 'light' },
  { name: 'dark / ltr', dir: 'ltr', theme: 'dark' },
  { name: 'dark / rtl', dir: 'rtl', theme: 'dark' },
] as const

/**
 * `color-contrast` is asserted separately (the test below, and the palette guard
 * in `src/lib/contrast.spec.ts`): the palette has documented brand-limited
 * exceptions — muted text and the primary solid button — that axe would flag on
 * almost every page. Everything else must be clean.
 */
const HANDLED_SEPARATELY = new Set(['color-contrast'])

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>

/** Human-readable messages for every violation axe reports that we don't exempt. */
function unexpectedViolations(violations: AxeResults['violations']): string[] {
  return violations
    .filter((violation) => !HANDLED_SEPARATELY.has(violation.id))
    .map(
      (violation) =>
        `${violation.id} (${violation.impact}): ${violation.nodes
          .map((node) => node.target.join(' '))
          .join(', ')}`,
    )
}

for (const variant of VARIANTS) {
  test.describe(variant.name, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/?dir=${variant.dir}&theme=${variant.theme}`)
      await page.waitForSelector('[data-contrast-probe]')
    })

    test('has no unexpected accessibility violations', async ({ page }) => {
      const { violations } = await new AxeBuilder({ page }).analyze()
      expect(unexpectedViolations(violations)).toEqual([])
    })

    test('resolves the design tokens in real CSS', async ({ page }) => {
      const colors = await page.evaluate(() => {
        const background = (selector: string) =>
          getComputedStyle(document.querySelector(selector) as HTMLElement).backgroundColor
        return { token: background('[data-token-probe]'), surface: background('[data-surface-probe]') }
      })
      // Proves Tailwind generated the utilities and the tokens resolved.
      expect(colors.token).toBe('rgb(0, 162, 221)')
      expect(colors.surface).toBe(variant.theme === 'dark' ? 'rgb(26, 30, 37)' : 'rgb(255, 255, 255)')
    })

    test('body text meets WCAG AA contrast', async ({ page }) => {
      const ratio = await page.evaluate(() => {
        const channel = (value: number) => {
          const c = value / 255
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
        }
        const luminance = ([r, g, b]: number[]) =>
          0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
        const rgb = (color: string) =>
          (color.match(/\d+(\.\d+)?/g) ?? ['0', '0', '0']).slice(0, 3).map(Number)

        const probe = document.querySelector('[data-contrast-probe]') as HTMLElement
        const foreground = luminance(rgb(getComputedStyle(probe).color))
        const background = luminance(rgb(getComputedStyle(document.body).backgroundColor))
        const [hi, lo] = [foreground, background].sort((a, b) => b - a)
        return (hi + 0.05) / (lo + 0.05)
      })
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })
  })
}

for (const variant of VARIANTS) {
  test.describe(`narrow viewport / ${variant.name} (responsive DataTable disclosure)`, () => {
    test.beforeEach(async ({ page }) => {
      // Below `sm`: both harness DataTable columns with `hideBelow` collapse into
      // the row disclosure, so axe covers the expander button and the <dl>.
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto(`/?dir=${variant.dir}&theme=${variant.theme}`)
      await page.waitForSelector('[data-contrast-probe]')
    })

    test('renders the disclosure and has no unexpected accessibility violations', async ({ page }) => {
      await expect(page.locator('tbody dl')).toBeVisible()
      const { violations } = await new AxeBuilder({ page }).analyze()
      expect(unexpectedViolations(violations)).toEqual([])
    })
  })
}
