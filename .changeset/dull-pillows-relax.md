---
"@myghf/ui": minor
---

feat: dark mode, Toaster/useToast, Alert/Message, InputNumber, Drawer, DatePicker i18n

The Tailwind preset now sets `darkMode: ['class', '.dark']`. Consumers who relied on Tailwind's default `media` strategy must add the `.dark` class (for example on `<html>`) for `dark:` utilities to take effect.
