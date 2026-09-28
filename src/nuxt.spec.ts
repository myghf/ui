import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Nuxt } from '@nuxt/schema'
import * as ui from './index'
import myghfUiModule, {
  AUTO_IMPORT_COMPONENTS,
  AUTO_IMPORT_COMPOSABLES,
  AUTO_IMPORT_UTILITIES,
  TAILWIND_CONTENT_GLOB,
  resolveAutoImports,
  wireTailwindConfig,
} from './nuxt'

// `getOptions` only reads `nuxt.options` for the module's config key, so a
// minimal stub is enough to exercise the defaults without a Nuxt runtime.
const nuxtStub = { options: {} } as unknown as Nuxt

describe('@myghf/ui Nuxt module', () => {
  it('declares its metadata', async () => {
    const meta = await myghfUiModule.getMeta?.()
    expect(meta?.name).toBe('@myghf/ui')
    expect(meta?.configKey).toBe('myghfUi')
  })

  it('defaults to auto-imports and Tailwind wiring enabled with an empty prefix', async () => {
    const options = await myghfUiModule.getOptions?.({}, nuxtStub)
    expect(options).toMatchObject({ autoImports: true, prefix: '', tailwind: true })
  })

  it('exposes the component export names for auto-import', () => {
    expect(AUTO_IMPORT_COMPONENTS).toContain('Button')
    expect(AUTO_IMPORT_COMPONENTS).toContain('DataTable')
    expect(AUTO_IMPORT_COMPONENTS.length).toBeGreaterThan(10)
    expect(new Set(AUTO_IMPORT_COMPONENTS).size).toBe(AUTO_IMPORT_COMPONENTS.length)
  })

  it('keeps AUTO_IMPORT_COMPONENTS in sync with the component exports in index.ts', () => {
    const source = readFileSync(new URL('./index.ts', import.meta.url), 'utf8')
    const exportedComponents = [
      ...source.matchAll(/export\s*\{\s*default\s+as\s+(\w+)\s*\}/g),
    ].map((match) => match[1])

    expect(exportedComponents.length).toBeGreaterThan(10)
    expect([...AUTO_IMPORT_COMPONENTS].sort()).toEqual(exportedComponents.sort())
  })

  it('lists the composables that are auto-imported', () => {
    expect(AUTO_IMPORT_COMPOSABLES).toEqual([
      'useTheme',
      'createTheme',
      'useToast',
      'createToastStore',
      'toastKey',
      'useFormField',
    ])
  })

  it('classifies useFormField as a composable, not a utility', () => {
    expect(AUTO_IMPORT_COMPOSABLES).toContain('useFormField')
    expect(AUTO_IMPORT_UTILITIES).not.toContain('useFormField')
  })

  it('lists the utilities that are auto-imported', () => {
    expect(AUTO_IMPORT_UTILITIES).toEqual(
      expect.arrayContaining([
        'cn',
        'toneClasses',
        'toPascalCase',
        'resolveIconName',
        'toNumberOrNull',
        'mergeFormatOptions',
        'dateToValue',
        'valueToDate',
        'toMinutes',
        'toTime',
        'clampTime',
        'sortRange',
        'toISODate',
        'buildHourOptions',
        'buildMinuteOptions',
        'to12Hour',
        'from12Hour',
        'getFirstDayOfWeek',
        'getWeekdayLabels',
        'getMonthLabel',
        'formatLocalizedDate',
        'formatLocalizedTime',
      ]),
    )
  })

  it('keeps every index.ts runtime export in exactly one auto-import list', () => {
    const declared = new Set([
      ...AUTO_IMPORT_COMPONENTS,
      ...AUTO_IMPORT_COMPOSABLES,
      ...AUTO_IMPORT_UTILITIES,
    ])

    // No name may appear in more than one list.
    expect(declared.size).toBe(
      AUTO_IMPORT_COMPONENTS.length +
        AUTO_IMPORT_COMPOSABLES.length +
        AUTO_IMPORT_UTILITIES.length,
    )
    expect([...declared].sort()).toEqual(Object.keys(ui).sort())
  })

  it('resolves the autoImports option', () => {
    expect(resolveAutoImports(true)).toEqual({ components: true, composables: true })
    expect(resolveAutoImports(false)).toEqual({ components: false, composables: false })
    expect(resolveAutoImports({})).toEqual({ components: true, composables: true })
    expect(resolveAutoImports({ components: false })).toEqual({
      components: false,
      composables: true,
    })
    expect(resolveAutoImports({ composables: false })).toEqual({
      components: true,
      composables: false,
    })
  })

  describe('wireTailwindConfig', () => {
    it('wires the content glob and preset exactly once when called twice', () => {
      const preset = { theme: { extend: {} } }
      const tailwind: { config?: Record<string, unknown> } = {}

      wireTailwindConfig(tailwind, preset)
      wireTailwindConfig(tailwind, preset)

      expect(tailwind.config?.content).toEqual([TAILWIND_CONTENT_GLOB])
      expect(tailwind.config?.presets).toEqual([preset])
    })

    it('preserves pre-existing content and presets', () => {
      const preset = { theme: {} }
      const existingPreset = { theme: { screens: {} } }
      const tailwind = {
        config: {
          content: ['./app/**/*.vue'],
          presets: [existingPreset],
        },
      }

      wireTailwindConfig(tailwind, preset)

      expect(tailwind.config.content).toEqual(['./app/**/*.vue', TAILWIND_CONTENT_GLOB])
      expect(tailwind.config.presets).toEqual([existingPreset, preset])
    })

    it('supports the object form of Tailwind content', () => {
      const preset = { theme: {} }
      const tailwind = {
        config: {
          content: { relative: true, files: ['./app/**/*.vue'] },
        },
      }

      wireTailwindConfig(tailwind, preset)

      expect(tailwind.config.content).toEqual({
        relative: true,
        files: ['./app/**/*.vue', TAILWIND_CONTENT_GLOB],
      })
    })

    it('preserves a single-string Tailwind content glob instead of dropping it', () => {
      const preset = { theme: {} }
      const tailwind = { config: { content: './app/**/*.vue' } }

      wireTailwindConfig(tailwind, preset)

      expect(tailwind.config.content).toEqual(['./app/**/*.vue', TAILWIND_CONTENT_GLOB])
    })

    it('stays idempotent for the string and object content forms', () => {
      const preset = { theme: {} }
      const stringForm = { config: { content: './app/**/*.vue' } }
      wireTailwindConfig(stringForm, preset)
      wireTailwindConfig(stringForm, preset)
      expect(stringForm.config.content).toEqual(['./app/**/*.vue', TAILWIND_CONTENT_GLOB])

      const objectForm = {
        config: { content: { relative: true, files: ['./app/**/*.vue'] } },
      }
      wireTailwindConfig(objectForm, preset)
      wireTailwindConfig(objectForm, preset)
      expect(objectForm.config.content).toEqual({
        relative: true,
        files: ['./app/**/*.vue', TAILWIND_CONTENT_GLOB],
      })
    })
  })
})
