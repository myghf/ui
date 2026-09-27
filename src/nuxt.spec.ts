import { describe, expect, it } from 'vitest'
import type { Nuxt } from '@nuxt/schema'
import myghfUiModule, { AUTO_IMPORT_COMPONENTS } from './nuxt'

// `getOptions` only reads `nuxt.options` for the module's config key, so a
// minimal stub is enough to exercise the defaults without a Nuxt runtime.
const nuxtStub = { options: {} } as unknown as Nuxt

describe('@myghf/ui Nuxt module', () => {
  it('declares its metadata', async () => {
    const meta = await myghfUiModule.getMeta?.()
    expect(meta?.name).toBe('@myghf/ui')
    expect(meta?.configKey).toBe('myghfUi')
  })

  it('defaults to auto-imports enabled with an empty prefix', async () => {
    const options = await myghfUiModule.getOptions?.({}, nuxtStub)
    expect(options).toMatchObject({ autoImports: true, prefix: '' })
  })

  it('exposes the component export names for auto-import', () => {
    expect(AUTO_IMPORT_COMPONENTS).toContain('Button')
    expect(AUTO_IMPORT_COMPONENTS).toContain('DataTable')
    expect(AUTO_IMPORT_COMPONENTS.length).toBeGreaterThan(10)
    expect(new Set(AUTO_IMPORT_COMPONENTS).size).toBe(AUTO_IMPORT_COMPONENTS.length)
  })
})
