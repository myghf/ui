import { inject, type InjectionKey, type Ref } from 'vue'

/**
 * State shared by `AppShell` with the `Sidebar` and `Topbar` inside it, so the
 * toggle button and the off-canvas panel agree on open state and target id.
 */
export interface AppShellContext {
  /** Whether the off-canvas sidebar is open (small screens only). */
  open: Ref<boolean>
  toggle: () => void
  close: () => void
  /** Whether the sidebar collapses off-canvas below the `lg` breakpoint. */
  collapsible: boolean
  /** Id shared between the toggle (`aria-controls`) and the sidebar. */
  sidebarId: string
}

export const appShellKey: InjectionKey<AppShellContext> = Symbol('myghf-app-shell')

/** Reads the nearest `AppShell` context, or `null` when used standalone. */
export function useAppShell(): AppShellContext | null {
  return inject(appShellKey, null)
}
