import { computed, inject, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue'

export type ToastSeverity = 'info' | 'success' | 'warning' | 'danger' | 'secondary'

export type ToastPosition =
  | 'top-start' | 'top-center' | 'top-end'
  | 'bottom-start' | 'bottom-center' | 'bottom-end'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  title?: string
  description?: string
  severity?: ToastSeverity
  duration?: number
  position?: ToastPosition
  closable?: boolean
  icon?: string
  action?: ToastAction
}

export interface ToastItem extends ToastOptions {
  id: string
}

export interface ToastStoreOptions {
  max?: number
  duration?: number
  position?: ToastPosition
}

export interface ToastStore {
  /** All toasts, including those queued past `max`. */
  items: Ref<ToastItem[]>
  /** The `max` most recent toasts, oldest first. */
  visible: ComputedRef<ToastItem[]>
  add: (options: ToastOptions) => string
  remove: (id: string) => void
  clear: () => void
  info: (title: string, description?: string) => string
  success: (title: string, description?: string) => string
  warning: (title: string, description?: string) => string
  danger: (title: string, description?: string) => string
  secondary: (title: string, description?: string) => string
}

/** Injection key for the toast store provided by `<Toaster />`. */
export const toastKey: InjectionKey<ToastStore> = Symbol('myghf-toast')

let seq = 0

export function createToastStore(options: ToastStoreOptions = {}): ToastStore {
  const max = Math.max(1, options.max ?? 4)
  const duration = options.duration ?? 5000
  const position = options.position ?? 'top-end'

  const items = ref<ToastItem[]>([])
  const visible = computed(() => items.value.slice(0, max))

  function add(options: ToastOptions): string {
    const id = `toast-${++seq}`
    items.value.push({ severity: 'info', position, duration, ...options, id })
    return id
  }

  function remove(id: string) {
    const index = items.value.findIndex((item) => item.id === id)
    if (index !== -1) items.value.splice(index, 1)
  }

  function clear() {
    items.value = []
  }

  function convenience(severity: ToastSeverity) {
    return (title: string, description?: string) => add({ title, description, severity })
  }

  return {
    items,
    visible,
    add,
    remove,
    clear,
    info: convenience('info'),
    success: convenience('success'),
    warning: convenience('warning'),
    danger: convenience('danger'),
    secondary: convenience('secondary'),
  }
}

export function useToast(): ToastStore {
  const store = inject(toastKey)
  if (!store) {
    throw new Error('useToast() requires a <Toaster /> mounted above this component.')
  }
  return store
}
