// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PageContent from './PageContent.vue'

describe('PageContent', () => {
  it('wraps content in a centred container with vertical padding', () => {
    const classes = mount(PageContent).classes().join(' ')
    expect(classes).toContain('mx-auto')
    expect(classes).toContain('max-w-7xl')
    expect(classes).toContain('py-6')
  })

  it('applies the size variant', () => {
    expect(mount(PageContent, { props: { size: 'sm' } }).classes().join(' ')).toContain('max-w-3xl')
  })
})
