# @myghf/ui

## 0.5.2

### Patch Changes

- 7932b4e: fix: stop Dialog and Drawer pointing aria-describedby at a description that was never rendered

## 0.5.1

### Patch Changes

- 8bfcb0d: fix: portal the DatePicker and Select popups so an ancestor with overflow (such as Dialog) no longer clips them
- 4096b53: fix: constrain the Dialog body so tall content scrolls instead of being clipped and unreachable

## 0.5.0

### Minor Changes

- 5115cb6: fix: explicit/optional/idempotent Nuxt Tailwind wiring, DataTable loading state, and composable/utility auto-imports

## 0.4.0

### Minor Changes

- 6f7ce97: feat: add Spinner, Skeleton, Avatar, form-field family, Button icons, DropdownMenu completion, Input/Textarea enhancements, and an optional Nuxt module

## 0.3.0

### Minor Changes

- 4c5b2e4: feat: dark mode, Toaster/useToast, Alert/Message, InputNumber, Drawer, DatePicker i18n
  
  The Tailwind preset now sets `darkMode: ['class', '.dark']`. Consumers who relied on Tailwind's default `media` strategy must add the `.dark` class (for example on `<html>`) for `dark:` utilities to take effect.

### Patch Changes

- 019abad: fix: render Toaster default slot so useToast() works for descendants

## 0.2.0

### Minor Changes

- 3e0f356: Align design tokens with the MYGHF brand manual. This is a **breaking change** for anyone
  overriding tokens or relying on the previous color values.
  
  - Rename every CSS custom property from `--ahc-*` to `--myghf-*` (e.g.
    `--ahc-primary-500` -> `--myghf-primary-500`).
  - Replace the error/danger scale with MYGHF Red (`#E9322B`); it was a pink PrimeVue "danger" hue.
  - Correct the success/teal scale to MYGHF Teal (`#0DA79E`).
  - Set text to MYGHF Black (`#000000`), borders to the brand light gray (`#E6E6E6`), and muted text
    to the brand gray (`#808080`).
  - Add brand font stacks: Helvetica Neue (sans), Trajan Pro (serif), and GE SS Two (Arabic).
  - Make `Select` RTL-safe (`pr-8` -> `pe-8`).
  - Add `DESIGN.md` as the in-repo design-system reference.
