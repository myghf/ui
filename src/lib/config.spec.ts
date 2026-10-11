// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { createConfig, defaultConfig, provideMyGhfConfig, useMyGhfConfig } from './config'

function probe() {
  const state: { config: ReturnType<typeof useMyGhfConfig> | null } = { config: null }
  const Probe = defineComponent({
    setup() {
      state.config = useMyGhfConfig()
      return () => h('div')
    },
  })
  return { Probe, state }
}

describe('createConfig', () => {
  it('defaults to English', () => {
    const config = createConfig()
    expect(config.locale).toBe('en')
    expect(config.labels.close).toBe('Close')
  })

  it('uses the locale label set', () => {
    expect(createConfig({ locale: 'ar' }).labels.close).toBe('إغلاق')
  })

  it('matches the base language of a region locale', () => {
    expect(createConfig({ locale: 'ar-EG' }).labels.empty).toBe('لا توجد عناصر')
  })

  it('falls back to English for an unknown locale', () => {
    expect(createConfig({ locale: 'fr' }).labels.close).toBe('Close')
  })

  it('lets explicit labels override the locale set', () => {
    const config = createConfig({ locale: 'ar', labels: { close: 'Done' } })
    expect(config.labels.close).toBe('Done')
    expect(config.labels.clear).toBe('مسح')
  })
})

describe('useMyGhfConfig', () => {
  it('returns the English default without a provider', () => {
    const { Probe, state } = probe()
    mount(Probe)
    expect(state.config).toBe(defaultConfig)
  })

  it('returns the provided config', () => {
    const config = createConfig({ locale: 'ar' })
    const { Probe, state } = probe()
    mount(
      defineComponent({
        setup() {
          provideMyGhfConfig(config)
          return () => h(Probe)
        },
      }),
    )
    expect(state.config).toBe(config)
  })
})
