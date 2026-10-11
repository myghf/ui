import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const componentsDir = fileURLToPath(new URL('../components', import.meta.url))

/**
 * Utilities that always assume left-to-right. The suite uses their logical
 * equivalents (`ps`/`pe`/`ms`/`me`/`start`/`end`, `text-start`/`text-end`,
 * `border-s`/`border-e`, `rounded-s`/`rounded-e`) or an `rtl:` variant, so a
 * physical one appearing here is almost always a direction bug.
 */
const PHYSICAL =
  /\b(?:pl|pr|ml|mr|text-left|text-right|border-l|border-r|rounded-l|rounded-r)-[a-z0-9./[\]-]+/g

function vueFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? vueFiles(full) : full.endsWith('.vue') ? [full] : []
  })
}

describe('RTL coverage', () => {
  it('uses logical utilities instead of physical left/right ones', () => {
    const offenders = vueFiles(componentsDir).flatMap((file) => {
      const source = readFileSync(file, 'utf8')
      return [...source.matchAll(PHYSICAL)].map(
        (match) => `${file.replace(`${componentsDir}/`, '')} → ${match[0]}`,
      )
    })
    expect(offenders, `physical utilities found:\n${offenders.join('\n')}`).toEqual([])
  })
})
