---
"@myghf/ui": minor
---

Align design tokens with the MYGHF brand manual. This is a **breaking change** for anyone
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
