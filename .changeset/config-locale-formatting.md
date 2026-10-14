---
'@myghf/ui': minor
---

feat(i18n): format DatePicker, TimePicker, and InputNumber through the config locale

The three formatting components now resolve their `locale` as: the
`locale` prop, then the provided config's locale, then the runtime
locale. So `provideMyGhfConfig(createConfig({ locale: 'ar' }))`
localizes their dates, times, and numbers without per-component props.
Adds a public `browserLocale()` helper (the runtime-locale fallback) and
an internal `useProvidedLocale()` composable. The runtime fallback keeps
the previous auto-detection when there is no provider.
