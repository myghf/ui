# MYGHF Design Guidelines

Machine-readable design system for the **Magdi Yacoub Global Heart Foundation (MYGHF)** and the
**Aswan Heart Centre (AHC)**, applied to the `@myghf/ui` component library.

Source: MYGHF brand manual, adapted for this repository.

> This file is written for AI agents and developers. Follow it literally when building UI with
> `@myghf/ui` or producing any MYGHF-branded material. If a request conflicts with these rules,
> follow the rules unless a human explicitly overrides them.

---

## 1. Brand Identity

- **Organization:** Magdi Yacoub Global Heart Foundation (MYGHF)
- **Facility:** Aswan Heart Centre (AHC)
- **Also in use:** Aswan Research Centre (ARC)
- **Bilingual:** English and Arabic are both first-class. Arabic is RTL.
- **Website:** https://myglobalheart.org
- **Tone:** Humanitarian, clinical, trustworthy, warm, dignified. Not playful, not corporate-cold.

### Brand name forms

| Context | Correct form |
| --- | --- |
| Full name | Magdi Yacoub Global Heart Foundation |
| Short name | MYGHF |
| Facility | Aswan Heart Centre |
| Facility short | AHC |

Do not invent abbreviations (e.g. never "MJHF", never "MY Heart Foundation").

---

## 2. Logo

### 2.1 What the logo is

A stylized **heart outline** formed by two strokes (blue swoosh + red loop) sitting above a set of
**golden mountain peaks**, with a stacked wordmark below:

```
MAGDI YACOUB GLOBAL      <- Trajan Pro, letterspaced caps
HEART FOUNDATION         <- Trajan Pro, letterspaced caps
ASWAN HEART CENTRE / ASWAN RESEARCH CENTRE  <- Trajan Pro, letterspaced caps, smallest
```

Do **not** recreate the logo from fonts/CSS primitives. Always place the official raster or vector
asset. If no asset is available, ask for it — do not approximate.

**This library does not ship the logo or a logo component.** Logo rules apply to the applications
and materials that consume `@myghf/ui`.

### 2.2 Variations

Pick based on audience and language:

| Variation | Use |
| --- | --- |
| Aswan Heart Centre — English | Default for English materials about AHC |
| Aswan Heart Centre — Arabic | Default for Arabic materials about AHC |
| Aswan Research Centre — English | Materials about the research arm (ARC) |

Never mix the AHC and ARC sub-lines, and never mix English and Arabic sub-lines within one lockup.

### 2.3 Color usage

- **Primary (full color):** blue + red + gold mark with black wordmark. Use on white or light backgrounds.
- **Black monochrome:** permitted on white/light backgrounds.
- **White (reversed):** permitted only on these backgrounds:
  - Black `#000000`
  - MYGHF Blue `#00A2DD`
  - MYGHF Gold `#EDA827`
  - MYGHF Red `#E9322B`

Do not place the reversed (white) logo on mid-tone colors, photographs, or gradients.

### 2.4 Clear space

Minimum clear space on all four sides = **`x`**, where `x` is the cap-height of the
"HEART FOUNDATION" line in the wordmark (~1/8 of the logo's total height).

Practical rule: leave clear space equal to the height of the "HEART FOUNDATION" text block on every
side. No text, image edge, or other logo may enter this zone.

### 2.5 Minimum size

- **Minimum width: 2 cm (≈ 0.79 in / ≈ 57 px at 72 dpi).** Never render the logo smaller.
- For print below this, use the mono version only after checking legibility of the wordmark.

### 2.6 Logo don'ts (hard rules)

Never:

1. Squeeze (non-uniform scale)
2. Stretch (non-uniform scale)
3. Change the font of the wordmark
4. Outline / stroke the logo
5. Change any logo color
6. Place on a distracting or busy background

Always scale proportionally. Always preserve the aspect ratio of the source asset.

---

## 3. Color Palette

These values are implemented as CSS custom properties (`--myghf-*`) in
[`src/tokens.css`](./src/tokens.css) and exposed to Tailwind via
[`src/tailwindPreset.js`](./src/tailwindPreset.js). **Use the token or Tailwind class, never a raw
hex value, in component code.**

### Primary

| Name | Hex | Token | Tailwind | Role |
| --- | --- | --- | --- | --- |
| MYGHF Blue | `#00A2DD` | `--myghf-primary-500` | `primary-500` | Primary brand color, CTAs, headers, sub-brand sections |
| MYGHF Gold | `#EDA827` | `--myghf-warning-500` | `warning-500` | Accent, highlights, the mountain mark |
| MYGHF Red | `#E9322B` | `--myghf-error-500` | `error-500` | Accent, the heart loop, emphasis, alerts |

### Secondary

| Name | Hex | Token | Tailwind | Role |
| --- | --- | --- | --- | --- |
| MYGHF Plum | `#984C7C` | `--myghf-secondary-500` | `secondary-500` | Supporting sections, charts |
| MYGHF Teal | `#0DA79E` | `--myghf-success-500` | `success-500` | Supporting sections, charts, success |
| MYGHF Black | `#000000` | `--myghf-foreground` | `foreground` | Text, reversed logo backgrounds |

### Neutrals

| Name | Hex | Token | Tailwind | Role |
| --- | --- | --- | --- | --- |
| White | `#FFFFFF` | `--myghf-surface` | `surface` | Cards, default surface |
| Light gray | `#E6E6E6` | `--myghf-border` | `border` | Dividers, borders |
| Mid gray | `#808080` | `--myghf-muted` | `muted` / `grey` | Secondary text, placeholders |
| Page background | `#f8f9fa` | `--myghf-background` | `background` | App background (see divergences) |

### Tints

Every brand color is implemented as an **11-step scale (`50`–`900`, `500` = the brand value)**.
Use lighter steps for backgrounds and hover states, darker steps for text on light tints and for
emphasis. Never introduce new hues.

### Color rules

- Blue is the dominant brand color. Gold and red are accents; don't let them dominate.
- Maximum of **two** primary brand colors plus neutrals in a single layout.
- Text: black on light, white on blue/black. Never red text on blue, never gold text on white at
  small sizes (contrast fails).
- Maintain WCAG AA contrast (4.5:1 body, 3:1 large text) — verify before shipping.

---

## 4. Typography

### 4.1 English

| Font | Weights | Tailwind | Use |
| --- | --- | --- | --- |
| **Helvetica Neue** | Light, Regular, Medium, Bold | `font-sans` (default) | All English body copy, UI, headings |
| **Trajan Pro** | Regular, Bold | `font-serif` | Formal / ceremonial headlines, invitations, the wordmark |

### 4.2 Arabic

| Font | Weights | Tailwind | Use |
| --- | --- | --- | --- |
| **GE SS Two** | Light, Medium, Bold | `font-ar` | Primary Arabic typeface (headings + body) |
| **Adobe Arabic** | Regular, Bold | `font-ar` (fallback) | Secondary Arabic typeface |

### 4.3 Type rules

- Helvetica Neue is the default for everything unless the piece is formal (then Trajan Pro).
- Do not substitute fonts silently. If a brand font is unavailable, use the fallback stack and tell
  the human which font is missing.
- Wordmark letterforms are Trajan Pro — never re-render the wordmark in another font.
- Arabic and English are not mixed within one sentence or one logo lockup.
- Letter-spacing is part of the identity: wordmark and formal headlines use wide tracking; body copy
  is normal tracking.
- Set the Arabic font on RTL content: `<div dir="rtl" class="font-ar">…</div>`.

---

## 5. Applying This To This Library (AI Instructions)

1. **Tokens first.** Use the `--myghf-*` custom properties or the Tailwind classes from the preset.
   Do not hard-code hex values in components. Add a new token only if no existing token fits.
2. **Blue as primary.** Use `primary-500` for primary actions and brand surfaces; `warning-500` and
   `error-500` as accents only.
3. **Logo handling.** The library ships no logo. Consumers must use an official asset, preserve
   aspect ratio, respect the 2 cm minimum width and `x` clear space, and only use the white version
   on the four approved backgrounds.
4. **Typography.** Default to `font-sans` (Helvetica Neue); use `font-serif` (Trajan Pro) only for
   formal pieces. Arabic uses `font-ar` (GE SS Two).
5. **Bilingual / RTL.** Support `dir="rtl"` and never mix scripts inside a lockup. Prefer
   **logical** utilities (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`, `text-start`,
   `text-end`) over physical ones (`pl-*`, `pr-*`, `ml-*`, `mr-*`, `left-*`, `right-*`).
   Directional icons use the `rtl:` variant (e.g. `rtl:rotate-180`).
6. **Accessibility.** Check contrast against the palette above; do not invent colors to fix
   contrast — switch to black/white text instead. Interactive elements must be keyboard reachable
   and expose accessible names.
7. **Restraint.** White space is part of the brand. Do not fill the layout. Never add gradients,
   drop shadows, bevels, or decorative effects to the logo.

---

## 6. Divergences & Known Gaps

Where this implementation intentionally differs from, or does not yet fully satisfy, the brand
manual:

- **Page background.** The brand's default background is pure white; the library uses `#f8f9fa`
  so white surfaces (`surface`) remain visually distinct. Override `--myghf-background` to
  `255 255 255` for strict brand-white.
- **Destructive button contrast.** White text on `error-500` (`#E9322B`) is ≈4.2:1 — just under
  AA for small text. For small destructive labels prefer `error-600` (≈5.3:1) or larger text.
- **Typography.** The library previously shipped `DM Sans`; it is not a brand font and has been
  replaced by the Helvetica Neue stack. Helvetica Neue / Trajan Pro / GE SS Two / Adobe Arabic are
  not webfonts bundled here — consumers must supply them or rely on the fallbacks.
- **Logo.** No logo asset or component is included in the package.
- **RTL coverage.** Directional icon flips and one logical-property fix are in place; new
  components must be checked against rule 5 above. There is no automated RTL visual test yet.
- **Fonts.** No `@font-face` declarations are shipped.

---

## 7. Scope Notes

This file covers brand identity, logo usage, color, and typography as they apply to the
`@myghf/ui` library, plus the rules for building with it. The source brand manual's stationery,
templates, and communication-guide sections are not included, so they are not specified here.

Extend this file rather than creating separate design docs. If a token or component changes the
brand rules, update the relevant section here in the same pull request.
