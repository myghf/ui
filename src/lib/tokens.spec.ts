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

  it('defines the same variables in the dark block as in :root', () => {
    const css = readFileSync(`${root}/src/tokens.css`, 'utf8')
    const light = varsInBlock(css, ':root')
    const dark = varsInBlock(css, "[data-theme='dark']")
    expect(light.size).toBeGreaterThan(0)
    expect([...dark].sort()).toEqual([...light].sort())
  })

  it('enables the .dark class variant in the preset', async () => {
    // tailwindPreset.js is a plain JS config with no type declarations.
    // @ts-expect-error TS7016: untyped JS module import.
    const preset = (await import('../tailwindPreset.js')).default
    expect(JSON.stringify(preset.darkMode)).toContain('.dark')
  })
})