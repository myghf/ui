import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { useTheme } from '@myghf/ui'
import Demo from './Demo.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Demo', Demo)
    // Create the shared controller eagerly and align it with the appearance
    // VitePress has already applied, so the first ThemeToggle rendered on the
    // site can never re-apply a stored preference and flip the page's theme.
    if (typeof document !== 'undefined') {
      const dark = document.documentElement.classList.contains('dark')
      useTheme().setMode(dark ? 'dark' : 'light')
    }
  },
} satisfies Theme
