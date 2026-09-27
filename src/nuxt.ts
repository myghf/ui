import { addComponent, defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  /** Auto-import the component exports. */
  autoImports?: boolean
  /** Optional prefix for auto-imported components. */
  prefix?: string
}

/**
 * Vue component exports that can be auto-imported by the Nuxt module.
 * Kept in sync with the component `default` exports in `src/index.ts`.
 */
export const AUTO_IMPORT_COMPONENTS = [
  'ThemeToggle',
  'Icon',
  'Button',
  'Input',
  'InputNumber',
  'Textarea',
  'Password',
  'Label',
  'FormField',
  'FormDescription',
  'FormMessage',
  'Checkbox',
  'Tag',
  'Alert',
  'Message',
  'Spinner',
  'Skeleton',
  'Avatar',
  'Tabs',
  'TabsList',
  'TabsTrigger',
  'TabsContent',
  'Select',
  'SelectButton',
  'DatePicker',
  'Dialog',
  'Drawer',
  'DropdownMenu',
  'DropdownMenuTrigger',
  'DropdownMenuContent',
  'DropdownMenuItem',
  'DropdownMenuSeparator',
  'DropdownMenuLabel',
  'DropdownMenuGroup',
  'TransferList',
  'Table',
  'TableHeader',
  'TableBody',
  'TableRow',
  'TableHead',
  'TableCell',
  'TableEmpty',
  'TablePagination',
  'DataTable',
  'TreeTable',
  'TreeSelect',
  'Toaster',
]

export default defineNuxtModule<ModuleOptions>({
  meta: { name: '@myghf/ui', configKey: 'myghfUi' },
  defaults: { autoImports: true, prefix: '' },
  async setup(options, nuxt) {
    nuxt.options.build.transpile.push('@myghf/ui')
    nuxt.options.css.unshift('@myghf/ui/tokens.css')

    // Tailwind is provided by @nuxtjs/tailwindcss, which is not a dependency
    // here, so access its config defensively.
    const tw = (nuxt.options as unknown as Record<string, unknown>).tailwindcss as
      | { config?: Record<string, unknown> }
      | undefined
    if (tw) {
      tw.config ??= {}
      const content = (tw.config.content as string[] | undefined) ?? []
      content.push('./node_modules/@myghf/ui/dist/**/*.js')
      tw.config.content = content
      const presets = (tw.config.presets as unknown[] | undefined) ?? []
      // Tailwind requires preset *objects*; it does not resolve string paths.
      // The specifier is a variable so it is resolved at runtime by the
      // consumer rather than bundled into this module.
      const presetId = '@myghf/ui/tailwind-preset'
      const preset = (await import(presetId)).default
      presets.push(preset)
      tw.config.presets = presets
    }

    if (options.autoImports) {
      for (const name of AUTO_IMPORT_COMPONENTS) {
        addComponent({ name: `${options.prefix}${name}`, export: name, filePath: '@myghf/ui' })
      }
    }
  },
})
