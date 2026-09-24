import * as Lucide from 'lucide-vue-next'
import { describe, expect, it } from 'vitest'
import { resolveIconName, toPascalCase } from './icons'

/** Lucide icon names used across client/src; guards against a lucide rename. */
const APP_ICONS = [
  'inbox', 'search', 'x', 'check', 'chevron-down', 'chevron-left', 'chevron-right',
  'chevron-up', 'plus', 'trash-2', 'pencil', 'eye', 'eye-off', 'star', 'send',
  'circle-alert', 'circle-check', 'triangle-alert', 'info', 'sliders-horizontal',
  'settings', 'clock', 'archive', 'calendar', 'building-2', 'users', 'user', 'upload',
  'link', 'globe', 'volume-2', 'undo-2', 'thumbs-up', 'tag', 'square', 'list-tree',
  'log-out', 'log-in', 'shield', 'qr-code', 'printer', 'play', 'paperclip', 'list-checks',
  'list', 'heart', 'hash', 'download', 'clipboard-list', 'chart-line', 'chart-bar',
  'book', 'menu', 'loader-circle',
]

describe('icons', () => {
  it('toPascalCase converts kebab-case to PascalCase', () => {
    expect(toPascalCase('chevron-down')).toBe('ChevronDown')
    expect(toPascalCase('sort-amount-down-alt')).toBe('SortAmountDownAlt')
  })

  it('every icon the app uses is exported by the installed lucide', () => {
    const lucide = Lucide as Record<string, unknown>
    const unresolved = APP_ICONS.filter((name) => !lucide[toPascalCase(name)])
    expect(unresolved).toEqual([])
  })

  it('resolveIconName normalises kebab and PascalCase names', () => {
    expect(resolveIconName('heart')).toBe('heart')
    expect(resolveIconName('chart-line')).toBe('chart-line')
    expect(resolveIconName('ChevronDown')).toBe('chevron-down')
    expect(resolveIconName('  Star  ')).toBe('star')
  })

  it('resolveIconName falls back to a circle for a blank name', () => {
    expect(resolveIconName('')).toBe('circle')
  })
})
