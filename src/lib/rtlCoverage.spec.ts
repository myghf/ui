import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const componentsDir = fileURLToPath(new URL('../components', import.meta.url))

/**
 * Utilities that always assume left-to-right. The suite uses their logical
 * equivalents (`ps`/`pe`/`ms`/`me`/`start`/`end`, `text-start`/`text-end`,
 * `border-s`/`border-e`, `rounded-s`/`rounded-e`) or an `rtl:` variant, so
 * a physical one appearing here is almost always a direction bug.
 *
 * `left`/`right` are banned too, except the `1/2` centering idiom, which is
 * direction-neutral. The Drawer's documented physical `left`/`right` positions
 * (which deliberately do not flip) are the one intentional exception.
 */
const PHYSICAL =
  /\b(?:pl|pr|ml|mr|text-left|text-right|border-l|border-r|rounded-l|rounded-r)-[a-z0-9./[\]-]+/g
const PHYSICAL_EDGE = /\b(?:left|right)-(?!1\/2\b)[a-z0-9./[\]-]+/g
/** Components with a documented, intentional physical `left`/`right` use. */
const PHYSICAL_ALLOWED = new Set(['drawer/Drawer.vue'])

function vueFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? vueFiles(full) : full.endsWith('.vue') ? [full] : []
  })
}

describe('RTL coverage', () => {
  it('uses logical utilities instead of physical left/right ones', () => {
    const offenders = vueFiles(componentsDir).flatMap((file) => {
      const rel = file.replace(`${componentsDir}/`, '')
      if (PHYSICAL_ALLOWED.has(rel)) return []
      const source = readFileSync(file, 'utf8')
      return [...source.matchAll(PHYSICAL), ...source.matchAll(PHYSICAL_EDGE)].map(
        (match) => `${rel} → ${match[0]}`,
      )
    })
    expect(offenders, `physical utilities found:\n${offenders.join('\n')}`).toEqual([])
  })

  it('flags physical edge utilities but exempts direction-neutral centering', () => {
    expect('x left-4 y'.match(PHYSICAL_EDGE)?.[0]).toBe('left-4')
    expect('x right-0 y'.match(PHYSICAL_EDGE)?.[0]).toBe('right-0')
    // `left-1/2` centers and does not assume a direction.
    expect('x left-1/2 y'.match(PHYSICAL_EDGE)).toBeNull()
  })
})
