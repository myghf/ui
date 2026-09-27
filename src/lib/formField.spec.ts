// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, provide } from 'vue'
import { formFieldKey, useFormField, type FormFieldContext } from './formField'

/**
 * `useFormField()` reads an injected context. `inject()` outside a component
 * setup warns and returns `undefined`, so the "no provider" contract is
 * exercised through a real component — that is the path consumers take.
 */
function captureField() {
  const state: { ctx: FormFieldContext | null } = { ctx: null }
  const Probe = defineComponent({
    setup() {
      state.ctx = useFormField()
      return () => h('div')
    },
  })
  return { Probe, state }
}

describe('useFormField', () => {
  it('returns null when there is no provider', () => {
    const { Probe, state } = captureField()
    mount(Probe)
    expect(state.ctx).toBeNull()
  })

  it('returns the provided context', () => {
    const ctx: FormFieldContext = {
      id: computed(() => 'field-1'),
      describedBy: computed(() => 'field-1-error'),
      invalid: computed(() => true),
      required: computed(() => true),
    }
    const { Probe, state } = captureField()
    const Parent = defineComponent({
      setup() {
        provide(formFieldKey, ctx)
        return () => h(Probe)
      },
    })
    mount(Parent)
    expect(state.ctx).toBe(ctx)
  })
})
