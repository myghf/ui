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

describe('design tokens vs tailwind preset', () => {
  it('exposes the same variable set in both files', () => {
    const defined = definedVars()
    const referenced = referencedVars()
    expect(defined.size).toBeGreaterThan(0)
    expect(referenced.size).toBeGreaterThan(0)
    expect([...defined].filter((v) => !referenced.has(v))).toEqual([])
    expect([...referenced].filter((v) => !defined.has(v))).toEqual([])
  })
})