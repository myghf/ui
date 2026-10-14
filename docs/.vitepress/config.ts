import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

// Read at build time so the docs topbar always shows the version Changesets
// last bumped — the same version the release workflow publishes to npm.
const { version } = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../package.json', import.meta.url)), 'utf8'),
) as { version: string }

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
      { text: `v${version}`, link: 'https://github.com/myghf/ui/releases' },
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
          { text: 'Localization', link: '/guide/i18n' },
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
              { text: 'Progress', link: '/components/progress' },
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
              { text: 'FormErrors', link: '/components/form-errors' },
              { text: 'Input', link: '/components/input' },
              { text: 'InputNumber', link: '/components/input-number' },
              { text: 'Textarea', link: '/components/textarea' },
              { text: 'Password', link: '/components/password' },
              { text: 'FileUpload', link: '/components/file-upload' },
              { text: 'Checkbox', link: '/components/checkbox' },
              { text: 'Switch', link: '/components/switch' },
              { text: 'RadioGroup', link: '/components/radio-group' },
              { text: 'Select', link: '/components/select' },
              { text: 'SelectButton', link: '/components/select-button' },
              { text: 'Combobox', link: '/components/combobox' },
              { text: 'DatePicker', link: '/components/date-picker' },
              { text: 'TimePicker', link: '/components/time-picker' },
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
              { text: 'Tooltip', link: '/components/tooltip' },
              { text: 'Popover', link: '/components/popover' },
              { text: 'Accordion', link: '/components/accordion' },
              { text: 'CommandPalette', link: '/components/command-palette' },
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
          {
            text: 'Layout',
            collapsed: false,
            items: [
              { text: 'Layout primitives', link: '/components/layout' },
              { text: 'Page', link: '/components/page' },
              { text: 'App shell', link: '/components/app-shell' },
            ],
          },
          {
            text: 'Charts',
            collapsed: false,
            items: [{ text: 'Charts', link: '/components/charts' }],
          },
          {
            text: 'Dashboard',
            collapsed: false,
            items: [{ text: 'Dashboard', link: '/components/dashboard' }],
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
          { text: 'hijri', link: '/utilities/hijri' },
          { text: 'number', link: '/utilities/number' },
          { text: 'csv', link: '/utilities/csv' },
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
