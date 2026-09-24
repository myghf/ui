export function toPascalCase(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

const FALLBACK_ICON = 'circle'

/**
 * Normalises a lucide icon reference to a kebab-case name: accepts `heart`,
 * `chart-line` or `ChevronDown`. An empty name falls back to a circle rather
 * than rendering nothing, so a gap is visible instead of silent.
 */
export function resolveIconName(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return FALLBACK_ICON
  return trimmed
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}
