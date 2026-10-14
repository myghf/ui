import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * Automated WCAG contrast check for the design tokens.
 *
 * axe cannot compute contrast inside jsdom (no layout/paint), and a real browser
 * runner is out of scope for now, so this asserts the *token palette* directly:
 * it parses `--myghf-*` RGB triples from `src/tokens.css` and applies the WCAG
 * relative-luminance formula to the pairs that `DESIGN.md` documents.
 *
 * Known brand limits (mid-gray text and the red solid button) are pinned with
 * floors rather than AA thresholds so a regression is caught while the
 * documented exception stays visible. See `DESIGN.md` §6.
 */

const componentsDir = fileURLToPath(new URL('../components', import.meta.url))

type Rgb = [number, number, number]

const tokensCss = readFileSync(fileURLToPath(new URL('../tokens.css', import.meta.url)), 'utf8')
const WHITE: Rgb = [255, 255, 255]
const SCALES = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const

function parseVars(block: string): Record<string, Rgb> {
  const vars: Record<string, Rgb> = {}
  for (const match of block.matchAll(/--myghf-([\w-]+):\s*(\d+)\s+(\d+)\s+(\d+)/g)) {
    vars[match[1]] = [Number(match[2]), Number(match[3]), Number(match[4])]
  }
  return vars
}

function blockFor(pattern: RegExp): Record<string, Rgb> {
  const match = tokensCss.match(pattern)
  if (!match) throw new Error(`token block not found for ${pattern}`)
  return parseVars(match[1])
}

const light = blockFor(/:root\s*{([^}]*)}/)
const dark = blockFor(/\[data-theme='dark'\][^{]*{([^}]*)}/)

function lin(channel: number): number {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminance([r, g, b]: Rgb): number {
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Blends a colour at `alpha` over `background` (used for the dark `*-900/40` tints). */
function composite(fg: Rgb, background: Rgb, alpha: number): Rgb {
  return fg.map((channel, i) => Math.round(channel * alpha + background[i] * (1 - alpha))) as Rgb
}

function token(map: Record<string, Rgb>, name: string): Rgb {
  const value = map[name]
  if (!value) throw new Error(`missing token --myghf-${name}`)
  return value
}

function vueFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? vueFiles(full) : full.endsWith('.vue') ? [full] : []
  })
}

/**
 * A single class string that pairs `bg-primary-500` with white text. White on
 * MYGHF Blue is ≈2.9:1 — below even the 3:1 large-text / non-text floor — so
 * the pair is inaccessible at any size. The primary action uses `primary-700`
 * instead; this guards the source so the pair cannot return.
 */
const WHITE_ON_PRIMARY =
  /["'`][^"'`\n]*bg-primary-500[^"'`\n]*text-white[^"'`\n]*["'`]|["'`][^"'`\n]*text-white[^"'`\n]*bg-primary-500[^"'`\n]*["'`]/g

const AA = 4.5

describe('token contrast', () => {
  it('body text meets WCAG AA on the light surfaces', () => {
    for (const surface of ['background', 'surface', 'surface-muted']) {
      expect(
        contrast(token(light, 'foreground'), token(light, surface)),
        `foreground on ${surface}`,
      ).toBeGreaterThanOrEqual(AA)
    }
  })

  it('body text meets WCAG AA on the dark surfaces', () => {
    for (const surface of ['background', 'surface', 'surface-muted']) {
      expect(
        contrast(token(dark, 'foreground'), token(dark, surface)),
        `dark foreground on ${surface}`,
      ).toBeGreaterThanOrEqual(AA)
    }
  })

  it('brand tint text meets WCAG AA in light mode (*-800 on *-100)', () => {
    for (const scale of SCALES) {
      expect(
        contrast(token(light, `${scale}-800`), token(light, `${scale}-100`)),
        `${scale}-800 on ${scale}-100`,
      ).toBeGreaterThanOrEqual(AA)
    }
  })

  it('brand tint text meets WCAG AA in dark mode (*-200 on *-900/40 over surface)', () => {
    // Brand scales are declared once in `:root` and inherited in dark mode
    // (the dark block overrides only the semantic tokens), so the scale values
    // come from the light map and are composited over the dark surface.
    const surface = token(dark, 'surface')
    for (const scale of SCALES) {
      const background = composite(token(light, `${scale}-900`), surface, 0.4)
      expect(
        contrast(token(light, `${scale}-200`), background),
        `${scale}-200 on ${scale}-900/40`,
      ).toBeGreaterThanOrEqual(AA)
    }
  })

  it('solid button text meets WCAG AA', () => {
    // White on the plum (secondary) button and the dark blue (primary-700)
    // button both pass AA.
    expect(contrast(WHITE, token(light, 'secondary-500'))).toBeGreaterThanOrEqual(AA)
    expect(contrast(WHITE, token(light, 'primary-700'))).toBeGreaterThanOrEqual(AA)
  })

  it('keeps the documented brand contrast exceptions from regressing', () => {
    const exceptions = [
      // Mid-gray secondary text: brand uses #808080, which is below AA. DESIGN.md §3.
      { label: 'muted on surface', value: contrast(token(light, 'muted'), token(light, 'surface')), floor: 3.9 },
      // White on MYGHF Red (destructive button) is a documented ≈4.2:1 caveat. DESIGN.md §6.
      { label: 'white on error-500', value: contrast(WHITE, token(light, 'error-500')), floor: 4.2 },
    ]
    for (const { label, value, floor } of exceptions) {
      expect(value, `${label} (measured ${value.toFixed(2)}:1)`).toBeGreaterThanOrEqual(floor)
    }
  })

  it('never pairs bg-primary-500 with white text', () => {
    const offenders = vueFiles(componentsDir).flatMap((file) => {
      const source = readFileSync(file, 'utf8')
      return [...source.matchAll(WHITE_ON_PRIMARY)].map(
        (match) => `${file.replace(`${componentsDir}/`, '')} → ${match[0]}`,
      )
    })
    expect(offenders, `white on primary-500 found:\n${offenders.join('\n')}`).toEqual([])
  })
})
