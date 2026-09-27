import { inject, type ComputedRef, type InjectionKey } from 'vue'

/**
 * Shared context provided by `FormField` and consumed by `Label` (and, in
 * later tasks, `Input`, `Textarea`, and `Select`) to auto-wire `for`/`id`,
 * `aria-describedby`, `aria-invalid`, and `required` onto a control.
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
