import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MYGHF UI',
  description:
    'The Magdi Yacoub Global Heart Foundation shared Vue 3 + Tailwind design system.',
  lang: 'en',
  // `srcDir` is `docs/`, so this excludes `docs/superpowers/**` from the site.
  srcExclude: ['superpowers/**'],
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
  ],

  themeConfig: {
    logo: { src: '/logo.png', alt: 'MYGHF UI logo' },
    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: 'Components', link: '/components/index', activeMatch: '/components/' },
      { text: 'Composables', link: '/composables/use-theme', activeMatch: '/composables/' },
      { text: 'Utilities', link: '/utilities/cn', activeMatch: '/utilities/' },
      { text: 'Tokens', link: '/reference/tokens', activeMatch: '/reference/' },
      { text: 'GitHub', link: 'https://github.com/myghf/ui' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Setup', link: '/guide/setup' },
          { text: 'Nuxt', link: '/guide/nuxt' },
          { text: 'Theming', link: '/guide/theming' },
          { text: 'RTL & bilingual', link: '/guide/rtl' },
          { text: 'Accessibility', link: '/guide/accessibility' },
          { text: 'Icons', link: '/guide/icons' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Overview', link: '/components/index' },
          {
            text: 'Actions & display',
            collapsed: false,
            items: [
              { text: 'Button', link: '/components/button' },
              { text: 'Tag', link: '/components/tag' },
              { text: 'Alert / Message', link: '/components/alert' },
              { text: 'Spinner', link: '/components/spinner' },
              { text: 'Skeleton', link: '/components/skeleton' },
              { text: 'Avatar', link: '/components/avatar' },
              { text: 'ThemeToggle', link: '/components/theme-toggle' },
              { text: 'Icon', link: '/components/icon' },
            ],
          },
          {
            text: 'Form',
            collapsed: false,
            items: [
              { text: 'Form field', link: '/components/form-field' },
              { text: 'Input', link: '/components/input' },
              { text: 'InputNumber', link: '/components/input-number' },
              { text: 'Textarea', link: '/components/textarea' },
              { text: 'Password', link: '/components/password' },
              { text: 'Checkbox', link: '/components/checkbox' },
              { text: 'Select', link: '/components/select' },
              { text: 'SelectButton', link: '/components/select-button' },
              { text: 'DatePicker', link: '/components/date-picker' },
              { text: 'TreeSelect', link: '/components/tree-select' },
              { text: 'TransferList', link: '/components/transfer-list' },
            ],
          },
          {
            text: 'Overlays',
            collapsed: false,
            items: [
              { text: 'Dialog', link: '/components/dialog' },
              { text: 'Drawer', link: '/components/drawer' },
              { text: 'DropdownMenu', link: '/components/dropdown-menu' },
              { text: 'Toast', link: '/components/toast' },
            ],
          },
          {
            text: 'Navigation & data',
            collapsed: false,
            items: [
              { text: 'Tabs', link: '/components/tabs' },
              { text: 'Table', link: '/components/table' },
              { text: 'DataTable', link: '/components/data-table' },
              { text: 'TreeTable', link: '/components/tree-table' },
            ],
          },
        ],
      },
      {
        text: 'Composables',
        items: [
          { text: 'useTheme', link: '/composables/use-theme' },
          { text: 'useToast', link: '/composables/use-toast' },
        ],
      },
      {
        text: 'Utilities',
        items: [
          { text: 'cn', link: '/utilities/cn' },
          { text: 'date', link: '/utilities/date' },
          { text: 'locale', link: '/utilities/locale' },
          { text: 'number', link: '/utilities/number' },
          { text: 'icons', link: '/utilities/icons' },
          { text: 'tones', link: '/utilities/tones' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Design tokens', link: '/reference/tokens' },
          { text: 'Tailwind preset', link: '/reference/tailwind-preset' },
        ],
      },
      {
        text: 'Development',
        items: [{ text: 'Development', link: '/development' }],
      },
    ],

    outline: { level: [2, 3], label: 'On this page' },

    search: { provider: 'local' },

    editLink: {
      pattern: 'https://github.com/myghf/ui/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/myghf/ui' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: '© Magdi Yacoub Global Heart Foundation',
    },
  },

  vite: {
    resolve: {
      alias: {
        // Demos import from `@myghf/ui` exactly like consumers, rendering `src/`.
        '@myghf/ui': fileURLToPath(new URL('../../src/index.ts', import.meta.url)),
      },
    },
  },
})
