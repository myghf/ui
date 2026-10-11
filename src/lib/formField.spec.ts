// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, nextTick, provide, ref } from 'vue'
import { formFieldKey, useFieldControl, useFormField, type FormFieldContext } from './formField'

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

describe('useFieldControl', () => {
  type Sources = Parameters<typeof useFieldControl>[0]

  /** Mounts a probe that resolves the field state and exposes the computed refs. */
  function captureControl(sources: Sources = {}, ctx?: FormFieldContext) {
    const state: { control: ReturnType<typeof useFieldControl> | null } = { control: null }
    const Probe = defineComponent({
      setup() {
        state.control = useFieldControl(sources)
        return () => h('div')
      },
    })
    const Parent = defineComponent({
      setup() {
        if (ctx) provide(formFieldKey, ctx)
        return () => h(Probe)
      },
    })
    mount(Parent)
    return state.control!
  }

  const context: FormFieldContext = {
    id: computed(() => 'ctx-id'),
    describedBy: computed(() => 'ctx-id-error'),
    invalid: computed(() => true),
    required: computed(() => true),
  }

  it('defaults when there is neither a provider nor explicit sources', () => {
    const control = captureControl()
    expect(control.id.value).toBeUndefined()
    expect(control.invalid.value).toBe(false)
    expect(control.required.value).toBe(false)
    expect(control.describedBy.value).toBeUndefined()
  })

  it('uses the context when supplied', () => {
    const control = captureControl({}, context)
    expect(control.id.value).toBe('ctx-id')
    expect(control.invalid.value).toBe(true)
    expect(control.required.value).toBe(true)
    expect(control.describedBy.value).toBe('ctx-id-error')
  })

  it('lets explicit sources beat the context', () => {
    const control = captureControl(
      { id: () => 'prop-id', invalid: () => false, required: () => false },
      context,
    )
    expect(control.id.value).toBe('prop-id')
    expect(control.invalid.value).toBe(false)
    expect(control.required.value).toBe(false)
    // describedBy has no explicit source, so it still comes from the context.
    expect(control.describedBy.value).toBe('ctx-id-error')
  })

  it('falls through to the context when a source returns undefined', () => {
    const control = captureControl(
      { id: () => undefined, invalid: () => undefined, required: () => undefined },
      context,
    )
    expect(control.id.value).toBe('ctx-id')
    expect(control.invalid.value).toBe(true)
    expect(control.required.value).toBe(true)
  })

  it('reacts to a source prop changing after mount', async () => {
    const idSource = ref<string | undefined>('first')
    const control = captureControl({ id: () => idSource.value })
    expect(control.id.value).toBe('first')
    idSource.value = 'second'
    await nextTick()
    expect(control.id.value).toBe('second')
  })
})
