---
'@myghf/ui': minor
---

feat(i18n): localize DataTable, CommandPalette, FileUpload, and TablePagination labels through the config provider

The remaining English-only built-in strings now read from the config's label
set, so `provideMyGhfConfig(createConfig({ locale: 'ar' }))` localizes them
without per-component props. Adds 22 keys (EN + AR) to `MyGhfLabels`; every
label prop still overrides the provider, and the English default is unchanged
outside a provider.
