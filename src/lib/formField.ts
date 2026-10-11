import { computed, inject, type ComputedRef, type InjectionKey } from 'vue'

/**
 * Shared context provided by `FormField` and consumed by form controls (via
 * `useFieldControl`) and by `Label` (via `useFormField`) to auto-wire
 * `for`/`id`, `aria-describedby`, `aria-invalid`, and `required` onto a control.
 *
 * Every member is a computed ref so the context stays reactive when the
 * `FormField` props change after mount.
 */
export interface FormFieldContext {
  /** The control id: the `FormField` `id` prop, or a generated fallback. */
  id: ComputedRef<string>
  /** Space-joined description/error ids, or `undefined` when neither exists. */
  describedBy: ComputedRef<string | undefined>
  /** `true` when the field should be marked invalid (defaults to `Boolean(error)`). */
  invalid: ComputedRef<boolean>
  /** `true` when the field is required. */
  required: ComputedRef<boolean>
}

export const formFieldKey: InjectionKey<FormFieldContext> = Symbol('myghf-form-field')

/**
 * Reads the nearest `FormField` context. Returns `null` when there is no
 * provider, so consumers can fall back to their explicit props and behave
 * exactly as they did before the context existed.
 */
export function useFormField(): FormFieldContext | null {
  return inject(formFieldKey, null)
}

/**
 * Reactive readers for a control's own props. Each returns `undefined` when the
 * prop was not supplied, so the value falls through to the `FormField` context.
 * `id` is a reader (not a plain value) because some controls name the prop
 * differently (e.g. `DatePicker` uses `inputId`).
 */
export interface FieldControlSources {
  id?: () => string | undefined
  invalid?: () => boolean | undefined
  required?: () => boolean | undefined
}

/** Resolved, reactive field state for a form control. */
export interface FieldControl {
  id: ComputedRef<string | undefined>
  invalid: ComputedRef<boolean>
  required: ComputedRef<boolean>
  describedBy: ComputedRef<string | undefined>
}

/**
 * Resolves a control's field state with one consistent precedence:
 * explicit prop, then the nearest `FormField` context, then a default. This is
 * the single place that wiring lives, so every control exposes `id`,
 * `aria-invalid`, `aria-describedby`, and `required` the same way.
 */
export function useFieldControl(sources: FieldControlSources = {}): FieldControl {
  const field = useFormField()
  return {
    id: computed(() => sources.id?.() ?? field?.id.value),
    invalid: computed(() => sources.invalid?.() ?? field?.invalid.value ?? false),
    required: computed(() => sources.required?.() ?? field?.required.value ?? false),
    describedBy: computed(() => field?.describedBy.value),
  }
}
