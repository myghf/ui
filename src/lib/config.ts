import { inject, provide, type InjectionKey } from 'vue'

/**
 * Built-in control strings. Every component that reads one of these also keeps
 * its own prop override, so the provider is only the default source.
 */
export interface MyGhfLabels {
  close: string
  clear: string
  clearSelection: string
  togglePasswordVisibility: string
  showOptions: string
  empty: string
  moveSelectedToTarget: string
  moveSelectedToSource: string
  moveAllToTarget: string
  moveAllToSource: string
  drawerTitle: string
  formErrorsTitle: string
  // DataTable
  emptyResults: string
  loading: string
  selectAllRows: string
  selectRow: string
  selected: string
  toggleRow: string
  search: string
  searchPlaceholder: string
  noResultsMatchFilters: string
  clearFilters: string
  // CommandPalette
  typeACommand: string
  searchCommands: string
  commandPalette: string
  commandPaletteDescription: string
  // FileUpload
  dropFilesPrompt: string
  browse: string
  remove: string
  // TablePagination
  rowsPerPage: string
  of: string
  previousPage: string
  nextPage: string
}

export interface MyGhfConfig {
  /** BCP-47 locale, e.g. `'en'`, `'ar-EG'`. */
  locale: string
  /** Built-in control strings. */
  labels: MyGhfLabels
}

const EN: MyGhfLabels = {
  close: 'Close',
  clear: 'Clear',
  clearSelection: 'Clear selection',
  togglePasswordVisibility: 'Toggle password visibility',
  showOptions: 'Show options',
  empty: 'Empty',
  moveSelectedToTarget: 'Move selected to target',
  moveSelectedToSource: 'Move selected to source',
  moveAllToTarget: 'Move all to target',
  moveAllToSource: 'Move all to source',
  drawerTitle: 'Drawer',
  formErrorsTitle: 'Please fix the following:',
  emptyResults: 'No results',
  loading: 'Loading…',
  selectAllRows: 'Select all rows',
  selectRow: 'Select row',
  selected: 'selected',
  toggleRow: 'Toggle row',
  search: 'Search',
  searchPlaceholder: 'Search…',
  noResultsMatchFilters: 'No results match your filters',
  clearFilters: 'Clear filters',
  typeACommand: 'Type a command…',
  searchCommands: 'Search commands',
  commandPalette: 'Command palette',
  commandPaletteDescription: 'Search for and run a command.',
  dropFilesPrompt: 'Drag and drop files here, or',
  browse: 'browse',
  remove: 'Remove',
  rowsPerPage: 'Rows per page',
  of: 'of',
  previousPage: 'Previous page',
  nextPage: 'Next page',
}

const AR: MyGhfLabels = {
  close: 'إغلاق',
  clear: 'مسح',
  clearSelection: 'مسح التحديد',
  togglePasswordVisibility: 'إظهار كلمة المرور',
  showOptions: 'عرض الخيارات',
  empty: 'لا توجد عناصر',
  moveSelectedToTarget: 'نقل المحدد إلى الوجهة',
  moveSelectedToSource: 'نقل المحدد إلى المصدر',
  moveAllToTarget: 'نقل الكل إلى الوجهة',
  moveAllToSource: 'نقل الكل إلى المصدر',
  drawerTitle: 'لوحة جانبية',
  formErrorsTitle: 'يرجى تصحيح ما يلي:',
  emptyResults: 'لا توجد نتائج',
  loading: 'جارٍ التحميل…',
  selectAllRows: 'تحديد كل الصفوف',
  selectRow: 'تحديد الصف',
  selected: 'محدد',
  toggleRow: 'تبديل الصف',
  search: 'بحث',
  searchPlaceholder: 'بحث…',
  noResultsMatchFilters: 'لا توجد نتائج مطابقة لعوامل التصفية',
  clearFilters: 'مسح عوامل التصفية',
  typeACommand: 'اكتب أمرًا…',
  searchCommands: 'بحث في الأوامر',
  commandPalette: 'لوحة الأوامر',
  commandPaletteDescription: 'ابحث عن أمر وشغّله.',
  dropFilesPrompt: 'اسحب وأفلت الملفات هنا، أو',
  browse: 'تصفح',
  remove: 'إزالة',
  rowsPerPage: 'صفوف لكل صفحة',
  of: 'من',
  previousPage: 'الصفحة السابقة',
  nextPage: 'الصفحة التالية',
}

const LABEL_SETS: Record<string, MyGhfLabels> = { en: EN, ar: AR }

export interface CreateConfigOptions {
  /** Defaults to `'en'`. */
  locale?: string
  /** Overrides on top of the locale's built-in labels. */
  labels?: Partial<MyGhfLabels>
}

/** Builds a config, defaulting the labels to the locale's built-in set (falling back to English). */
export function createConfig(options: CreateConfigOptions = {}): MyGhfConfig {
  const locale = options.locale ?? 'en'
  const base = LABEL_SETS[locale.split(/[-_]/)[0]] ?? EN
  return { locale, labels: { ...base, ...options.labels } }
}

export const myghfConfigKey: InjectionKey<MyGhfConfig> = Symbol('myghf-config')

/** The English config every component falls back to outside a provider. */
export const defaultConfig: MyGhfConfig = createConfig()

/** Provides a config to the app's component tree and returns it. */
export function provideMyGhfConfig(config: MyGhfConfig): MyGhfConfig {
  provide(myghfConfigKey, config)
  return config
}

/** Reads the nearest config, or the English default when there is no provider. */
export function useMyGhfConfig(): MyGhfConfig {
  return inject(myghfConfigKey, defaultConfig)
}
