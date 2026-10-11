---
'@myghf/ui': minor
---

Add a localization layer (config provider + English/Arabic labels)

- New `createConfig` / `provideMyGhfConfig` / `useMyGhfConfig` (plus `myghfConfigKey` and
  `defaultConfig`): provide a `{ locale, labels }` config at the app root to localize built-in
  control strings. Ships English and Arabic label sets, matching the locale's base language and
  falling back to English.
- Migrate the previously hardcoded strings to the config: `Select`/`Combobox` "Clear selection",
  `Combobox` "Show options", `Password` "Toggle password visibility", `Toast`/`Dialog`/`Drawer`
  "Close", `Drawer`'s title, `TreeSelect` "Clear", `TransferList` "Empty" and its four move
  labels, and `FormErrors`' default title. Existing per-component label props still override.
