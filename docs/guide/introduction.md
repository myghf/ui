# Introduction

`@myghf/ui` is the shared **Vue 3 + Tailwind** design system for the **Magdi Yacoub
Global Heart Foundation (MYGHF)** and its facilities, **Aswan Heart Centre (AHC)** and
**Aswan Research Centre (ARC)**. It keeps MYGHF applications visually and behaviorally
consistent: one palette, one set of primitives, one accessibility baseline.

## What's included

- **Components** built on [Vue 3](https://vuejs.org) and [Reka UI](https://reka-ui.com)
  primitives, styled with [Tailwind CSS](https://tailwindcss.com).
- **Design tokens** — CSS custom properties named `--myghf-*` — plus a **Tailwind preset**
  that maps them to utility classes.
- **Bilingual-ready**: English and Arabic are both first-class, with RTL support.
- **Accessible** by default: keyboard-operable primitives, visible focus states, and
  WCAG-minded contrast.
- **Tree-shakeable ESM** output with bundled TypeScript types.

## Brand context

MYGHF is the parent organization; AHC and ARC are its facilities. The brand tone is
humanitarian, clinical, trustworthy, warm, and dignified — not playful, and not
corporate-cold.

- **Blue** (`primary-500`, MYGHF Blue) is the dominant brand colour; **gold**
  (`warning-500`) and **red** (`error-500`) are accents.
- Limit a layout to **two** brand colours plus neutrals.
- The library **does not ship the logo or a logo component**. Consumers place an official
  asset and follow the logo rules — proportional scaling, a 2 cm minimum width, and the
  required clear space.

The complete brand manual — logo usage, palette, typography, dark mode, and the rules for
building with this library — lives in
[`DESIGN.md`](https://github.com/myghf/ui/blob/main/DESIGN.md). Follow it literally, and
extend it rather than writing a parallel design document.

## Principles

1. **Tokens first.** Use `--myghf-*` variables or the preset's Tailwind classes. Never
   hard-code a hex value, and add a token only when no existing token fits.
2. **Blue as primary.** Use `primary-500` for primary actions and brand surfaces; keep
   gold and red as accents.
3. **Bilingual by default.** Prefer logical utilities (`ps-*`, `pe-*`, `ms-*`, `me-*`,
   `start-*`, `end-*`, `text-start`, `text-end`) over physical ones, and use `rtl:`
   variants for directional icons.
4. **Accessible by default.** Interactive elements are keyboard reachable, expose
   accessible names, and verify contrast before shipping.
5. **Restraint.** White space is part of the brand. No gradients, bevels, or decorative
   effects.

## Where to go next

- [Install the package](/guide/installation) and [set it up](/guide/setup).
- Learn the [token and dark-mode model](/guide/theming).
- Read the [RTL and bilingual guide](/guide/rtl).
- Review the [accessibility notes](/guide/accessibility) and [icon guidance](/guide/icons).
