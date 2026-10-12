import {
  addComponent,
  addImports,
  defineNuxtModule,
  hasNuxtModule,
  logger,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

/** The module id `@nuxtjs/tailwindcss` is listed under in `nuxt.options.modules`. */
const TAILWIND_MODULE_ID = '@nuxtjs/tailwindcss'

/** Warned when `@nuxtjs/tailwindcss` never installs. */
const NOT_DETECTED_MESSAGE =
  "@nuxtjs/tailwindcss was not detected, so the @myghf/ui Tailwind preset and content glob were NOT added automatically. Add './node_modules/@myghf/ui/dist/**/*.js' to your Tailwind `content`, and import '@myghf/ui/tailwind-preset' and add the imported preset object to your `presets`, or set `myghfUi: { tailwind: false }` to silence this."

/**
 * Warned when the Tailwind module installed before this one with no
 * `tailwindcss` config block — its options are resolved only at install
 * time, so they can no longer be reached.
 */
const INSTALLED_WITHOUT_CONFIG_MESSAGE =
  "@nuxtjs/tailwindcss is installed but has no `tailwindcss` config block, so the @myghf/ui Tailwind preset and content glob were NOT added. Register `@myghf/ui/nuxt` before `@nuxtjs/tailwindcss` to wire them automatically, or add this to `nuxt.config` (with `import myghfPreset from '@myghf/ui/tailwind-preset'`):\n" +
  "tailwindcss: { config: { presets: [myghfPreset], content: ['./node_modules/@myghf/ui/dist/**/*.js'] } }\n" +
  'or set `myghfUi: { tailwind: false }` to silence this and wire Tailwind yourself.'

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
  'FileUpload',
  'Label',
  'FormField',
  'FormDescription',
  'FormMessage',
  'FormErrors',
  'Checkbox',
  'Switch',
  'RadioGroup',
  'Combobox',
  'Tag',
  'Alert',
  'Message',
  'Spinner',
  'Skeleton',
  'Progress',
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
  'Tooltip',
  'Popover',
  'Accordion',
  'AccordionItem',
  'CommandPalette',
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
  'Container',
  'Stack',
  'Inline',
  'Grid',
  'Breadcrumbs',
  'PageHeader',
  'PageContent',
  'AppShell',
  'Sidebar',
  'Topbar',
  'Sparkline',
  'BarChart',
  'StatCard',
  'StatusBadge',
  'Timeline',
  'TimelineItem',
  'Stepper',
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
  'useFormField',
  'useFieldControl',
  'createConfig',
  'provideMyGhfConfig',
  'useMyGhfConfig',
  'myghfConfigKey',
  'defaultConfig',
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
  'formatNumber',
  'formatCurrency',
  'formatPercent',
  'toCsv',
  'downloadCsv',
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
  'addDays',
  'hijriParts',
  'startOfHijriMonth',
  'hijriMonthLength',
  'hijriMonthLabel',
  'formatHijriDate',
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
 * Returns the Tailwind `content` value with the library glob appended, without
 * clobbering whatever shape the consumer already uses. Tailwind accepts a bare
 * string glob, an array of globs, or `{ files: [...] }`; an unrecognised value
 * falls back to a fresh array. Idempotent — a value already containing the glob
 * is returned unchanged.
 */
function appendContentGlob(content: unknown): unknown {
  if (typeof content === 'string') {
    return content === TAILWIND_CONTENT_GLOB
      ? [content]
      : [content, TAILWIND_CONTENT_GLOB]
  }
  if (Array.isArray(content)) {
    return content.includes(TAILWIND_CONTENT_GLOB)
      ? content
      : [...content, TAILWIND_CONTENT_GLOB]
  }
  if (
    content &&
    typeof content === 'object' &&
    Array.isArray((content as TailwindContentObject).files)
  ) {
    const object = content as TailwindContentObject
    const files = object.files as unknown[]
    return files.includes(TAILWIND_CONTENT_GLOB)
      ? object
      : { ...object, files: [...files, TAILWIND_CONTENT_GLOB] }
  }
  return [TAILWIND_CONTENT_GLOB]
}

/**
 * Adds the library's Tailwind content glob and preset to a
 * `@nuxtjs/tailwindcss` config. Idempotent: calling it repeatedly (e.g. a
 * module loaded more than once) never adds a duplicate entry. The string,
 * array, and `{ files: [...] }` forms of `content` are all preserved.
 */
export function wireTailwindConfig<T extends TailwindLikeOptions>(
  tailwind: T,
  preset: unknown,
): T {
  tailwind.config ??= {}
  const config = tailwind.config

  config.content = appendContentGlob(config.content)

  const presets = Array.isArray(config.presets) ? (config.presets as unknown[]) : []
  if (!presets.includes(preset)) {
    presets.push(preset)
  }
  config.presets = presets

  return tailwind
}

/** Minimal shape of an entry in Nuxt's installed-modules registry. */
interface InstalledModule {
  meta?: { name?: string }
}

/**
 * Returns whether `@nuxtjs/tailwindcss` has already run. Unlike
 * `hasNuxtModule`, this ignores modules that are only listed in
 * `nuxt.options.modules`: the Tailwind module resolves its options at
 * install time, so one listed after this module can still be reached,
 * while one listed before it cannot. The registry is private but is the
 * one Nuxt's own `hasNuxtModule` reads, and it lives on `nuxt.options`
 * in Nuxt 4 and on `nuxt` in Nuxt 3.
 */
export function hasInstalledTailwindModule(nuxt: Nuxt): boolean {
  const options = nuxt.options as unknown as
    | { _installedModules?: InstalledModule[] }
    | undefined
  const registries = [
    options?._installedModules,
    (nuxt as unknown as { _installedModules?: InstalledModule[] })
      ._installedModules,
  ]
  return registries.some(
    (registry) =>
      registry?.some(
        (module) => module?.meta?.name === TAILWIND_MODULE_ID,
      ) ?? false,
  )
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
      const tailwind = (nuxt.options as unknown as Record<
        string,
        TailwindLikeOptions | undefined
      >).tailwindcss
      // Tailwind requires preset *objects*; it does not resolve string
      // paths. The specifier is a variable so it is resolved at runtime by
      // the consumer rather than bundled into this module.
      const presetId = '@myghf/ui/tailwind-preset'
      const preset = (await import(presetId)).default

      if (tailwind) {
        wireTailwindConfig(tailwind, preset)
      } else if (hasInstalledTailwindModule(nuxt)) {
        // The Tailwind module installed before this one, and it resolves
        // its options only at install time, so they can no longer be
        // reached. Point at the config block that wires them.
        logger.warn(INSTALLED_WITHOUT_CONFIG_MESSAGE)
      } else {
        // The Tailwind module has not installed yet. When it is listed
        // after this module it resolves its options from
        // `nuxt.options.tailwindcss`, so seed the preset and content
        // glob there and the wiring is automatic. `modules:done` checks
        // whether it ever installed; if it did not, undo the seed.
        ;(nuxt.options as unknown as Record<
          string,
          TailwindLikeOptions
        >).tailwindcss = {
          config: {
            presets: [preset],
            content: [TAILWIND_CONTENT_GLOB],
          },
        }
        nuxt.hook('modules:done', () => {
          if (!hasNuxtModule(TAILWIND_MODULE_ID, nuxt)) {
            delete (nuxt.options as unknown as Record<string, unknown>)
              .tailwindcss
            logger.warn(NOT_DETECTED_MESSAGE)
          }
        })
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
