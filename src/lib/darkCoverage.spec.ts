import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const componentsDir = fileURLToPath(new URL('../components', import.meta.url))

function vueFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? vueFiles(full) : full.endsWith('.vue') ? [full] : []
  })
}

describe('dark coverage', () => {
  it('gives every light brand tint a dark variant in the same file', () => {
    const offenders = vueFiles(componentsDir).filter((file) => {
      const src = readFileSync(file, 'utf8')
      const tinted = /(bg-(primary|secondary|success|warning|error|info)-100)\b/.test(src)
      return tinted && !src.includes('dark:')
    })
    expect(offenders).toEqual([])
  })
})
