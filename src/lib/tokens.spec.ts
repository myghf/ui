import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = fileURLToPath(new URL('../..', import.meta.url))

function definedVars(): Set<string> {
  const css = readFileSync(`${root}/src/tokens.css`, 'utf8')
  return new Set(
    [...css.matchAll(/--myghf-[\w-]+\s*:/g)].map((m) => m[0].replace(/\s*:$/, '')),
  )
}

function referencedVars(): Set<string> {
  const js = readFileSync(`${root}/src/tailwindPreset.js`, 'utf8')
  return new Set([...js.matchAll(/var\((--myghf-[\w-]+)\)/g)].map((m) => m[1]))
}

function varsInBlock(css: string, selector: string): Set<string> {
  const start = css.indexOf(selector)
  if (start === -1) return new Set()
  const open = css.indexOf('{', start)
  const close = css.indexOf('}', open)
  return new Set(
    [...css.slice(open, close).matchAll(/--myghf-[\w-]+\s*:/g)].map((m) =>
      m[0].replace(/\s*:$/, ''),
    ),
  )
}

describe('design tokens vs tailwind preset', () => {
  it('exposes the same variable set in both files', () => {
    const defined = definedVars()
    const referenced = referencedVars()
    expect(defined.size).toBeGreaterThan(0)
    expect(referenced.size).toBeGreaterThan(0)
    expect([...defined].filter((v) => !referenced.has(v))).toEqual([])
    expect([...referenced].filter((v) => !defined.has(v))).toEqual([])
  })

  it('overrides only the semantic layer in the dark block', () => {
    const css = readFileSync(`${root}/src/tokens.css`, 'utf8')
    const light = varsInBlock(css, ':root')
    const dark = varsInBlock(css, "[data-theme='dark']")
    const required = [
      '--myghf-background',
      '--myghf-foreground',
      '--myghf-surface',
      '--myghf-surface-muted',
      '--myghf-border',
      '--myghf-muted',
    ]
    expect(light.size).toBeGreaterThan(0)
    for (const name of required) expect(dark.has(name)).toBe(true)
    // A strict subset: no variable is introduced, and brand scales are not re-declared.
    expect([...dark].filter((name) => !light.has(name))).toEqual([])
    expect(dark.size).toBeLessThan(light.size)
  })

  it('enables the .dark class variant in the preset', () => {
    const js = readFileSync(`${root}/src/tailwindPreset.js`, 'utf8')
    expect(js).toMatch(/darkMode\s*:\s*\[\s*['"]class['"]\s*,\s*['"]\.dark['"]\s*\]/)
  })
})