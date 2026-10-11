// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, provide, ref } from 'vue'
import { appShellKey, useAppShell, type AppShellContext } from './appShell'

function probe() {
  const state: { ctx: AppShellContext | null } = { ctx: null }
  const Probe = defineComponent({
    setup() {
      state.ctx = useAppShell()
      return () => h('div')
    },
  })
  return { Probe, state }
}

describe('useAppShell', () => {
  it('returns null outside an AppShell', () => {
    const { Probe, state } = probe()
    mount(Probe)
    expect(state.ctx).toBeNull()
  })

  it('returns the provided context', () => {
    const ctx: AppShellContext = {
      open: ref(false),
      toggle: () => {},
      close: () => {},
      collapsible: true,
      sidebarId: 'shell-1',
    }
    const { Probe, state } = probe()
    mount(
      defineComponent({
        setup() {
          provide(appShellKey, ctx)
          return () => h(Probe)
        },
      }),
    )
    expect(state.ctx).toBe(ctx)
  })
})
