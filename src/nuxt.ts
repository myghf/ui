import { addComponent, addImports, defineNuxtModule, logger } from '@nuxt/kit'

export interface ModuleOptions {
  /**
   * Auto-import the library's components, composables and utilities.
   * Pass an object to enable/disable the components and composables groups
   * independently (unspecified keys default to enabled).
   */
  autoImports?: boolean | { components?: boolean; composables?: boolean }
  /** Optional prefix for auto-imported components. */
  prefix?: string
  /**
   * Wire the Tailwind preset and content glob into `@nuxtjs/tailwindcss`.
   * Set to `false` to opt out and silence the "not detected" warning.
   */
  tailwind?: boolean
}

export interface ResolvedAutoImports {
  components: boolean
  composables: boolean
}

/**
 * Normalises the `autoImports` option into concrete per-group flags.
 * `true`/`undefined` enable everything, `false` disables everything, and an
 * object enables every key that is not explicitly set to `false`.
 */
export function resolveAutoImports(
  option: ModuleOptions['autoImports'],
): ResolvedAutoImports {
  if (option === false) return { components: false, composables: false }
  if (option === undefined || option === true) {
    return { components: true, composables: true }
  }
  return {
    components: option.components ?? true,
    composables: option.composables ?? true,
  }
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

/**
 * Composable (stateful `use*`/`create*`) exports that are auto-imported
 * unprefixed. Kept in sync with the runtime exports in `src/index.ts`.
 */
export const AUTO_IMPORT_COMPOSABLES = [
  'useTheme',
  'createTheme',
  'useToast',
  'createToastStore',
  'toastKey',
]

/**
 * Remaining pure runtime exports (helpers, formatters, tone/icon utilities)
 * that are auto-imported unprefixed. Together with `AUTO_IMPORT_COMPONENTS`
 * and `AUTO_IMPORT_COMPOSABLES` this covers every runtime export of
 * `src/index.ts`.
 */
export const AUTO_IMPORT_UTILITIES = [
  'cn',
  'toneClasses',
  'toPascalCase',
  'resolveIconName',
  'toNumberOrNull',
  'mergeFormatOptions',
  'useFormField',
  'dateToValue',
  'valueToDate',
  'toMinutes',
  'toTime',
  'clampTime',
  'sortRange',
  'toISODate',
  'buildHourOptions',
  'buildMinuteOptions',
  'to12Hour',
  'from12Hour',
  'getFirstDayOfWeek',
  'getWeekdayLabels',
  'getMonthLabel',
  'formatLocalizedDate',
  'formatLocalizedTime',
]

/** Tailwind content glob needed to scan the published library bundle. */
export const TAILWIND_CONTENT_GLOB = './node_modules/@myghf/ui/dist/**/*.js'

/** Minimal structural shape of the `@nuxtjs/tailwindcss` module options. */
export interface TailwindLikeOptions {
  config?: Record<string, unknown>
}

/** Tailwind's object form of `content`: `{ files: [...] }`. */
interface TailwindContentObject {
  files?: unknown[]
  [key: string]: unknown
}

/**
 * Resolves the mutable list of Tailwind content entries for either the array
 * form (a plain list of globs) or the object form (`{ files: [...] }`),
 * returning `null` when the value is missing or unrecognised.
 */
function contentEntries(content: unknown): unknown[] | null {
  if (Array.isArray(content)) return content
  if (
    content &&
    typeof content === 'object' &&
    Array.isArray((content as TailwindContentObject).files)
  ) {
    return (content as TailwindContentObject).files as unknown[]
  }
  return null
}

/**
 * Adds the library's Tailwind content glob and preset to a
 * `@nuxtjs/tailwindcss` config. Idempotent: calling it repeatedly (e.g. a
 * module loaded more than once) never adds a duplicate entry. Both the array
 * and `{ files: [...] }` forms of `content` are preserved.
 */
export function wireTailwindConfig<T extends TailwindLikeOptions>(
  tailwind: T,
  preset: unknown,
): T {
  tailwind.config ??= {}
  const config = tailwind.config

  const existingContent = contentEntries(config.content)
  const content = existingContent ?? []
  if (!content.includes(TAILWIND_CONTENT_GLOB)) {
    content.push(TAILWIND_CONTENT_GLOB)
  }
  if (!existingContent) {
    config.content = content
  }

  const presets = Array.isArray(config.presets) ? (config.presets as unknown[]) : []
  if (!presets.includes(preset)) {
    presets.push(preset)
  }
  config.presets = presets

  return tailwind
}

export default defineNuxtModule<ModuleOptions>({
  meta: { name: '@myghf/ui', configKey: 'myghfUi' },
  defaults: { autoImports: true, prefix: '', tailwind: true },
  async setup(options, nuxt) {
    nuxt.options.build.transpile.push('@myghf/ui')
    nuxt.options.css.unshift('@myghf/ui/tokens.css')

    if (options.tailwind !== false) {
      // Tailwind is provided by @nuxtjs/tailwindcss, which is an optional peer
      // and not a dependency here, so access its config defensively.
      const tailwind = (nuxt.options as unknown as Record<string, unknown>).tailwindcss as
        | TailwindLikeOptions
        | undefined
      if (tailwind) {
        // Tailwind requires preset *objects*; it does not resolve string paths.
        // The specifier is a variable so it is resolved at runtime by the
        // consumer rather than bundled into this module.
        const presetId = '@myghf/ui/tailwind-preset'
        const preset = (await import(presetId)).default
        wireTailwindConfig(tailwind, preset)
      } else {
        logger.warn(
          "@nuxtjs/tailwindcss was not detected, so the @myghf/ui Tailwind preset and content glob were NOT added automatically. Add './node_modules/@myghf/ui/dist/**/*.js' to your Tailwind `content` and '@myghf/ui/tailwind-preset' to your `presets`, or set `myghfUi: { tailwind: false }` to silence this.",
        )
      }
    }

    const autoImports = resolveAutoImports(options.autoImports)
    if (autoImports.components) {
      for (const name of AUTO_IMPORT_COMPONENTS) {
        addComponent({ name: `${options.prefix}${name}`, export: name, filePath: '@myghf/ui' })
      }
    }
    if (autoImports.composables) {
      for (const name of [...AUTO_IMPORT_COMPOSABLES, ...AUTO_IMPORT_UTILITIES]) {
        addImports({ name, from: '@myghf/ui' })
      }
    }
  },
})
