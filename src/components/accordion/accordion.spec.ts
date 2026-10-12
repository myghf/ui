// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Accordion from './Accordion.vue'
import AccordionItem from './AccordionItem.vue'

function mountAccordion(props: Record<string, unknown> = {}) {
  return mount(Accordion, {
    props: { modelValue: 'a', ...props },
    slots: {
      default: () => [
        h(AccordionItem, { value: 'a', title: 'Section A' }, { default: () => 'Body A' }),
        h(AccordionItem, { value: 'b', title: 'Section B' }, { default: () => 'Body B' }),
      ],
    },
  })
}

describe('Accordion', () => {
  it('renders one trigger per item', () => {
    const wrapper = mountAccordion()
    expect(wrapper.findAll('button')).toHaveLength(2)
    expect(wrapper.text()).toContain('Section A')
    expect(wrapper.text()).toContain('Section B')
  })

  it('reflects the open item on its trigger', () => {
    const triggers = mountAccordion({ modelValue: 'a' }).findAll('button')
    expect(triggers[0].attributes('aria-expanded')).toBe('true')
    expect(triggers[1].attributes('aria-expanded')).toBe('false')
  })

  it('renders the open item content', () => {
    expect(mountAccordion({ modelValue: 'a' }).text()).toContain('Body A')
  })

  it('emits update:modelValue when a trigger is clicked', async () => {
    const wrapper = mountAccordion({ modelValue: '' })
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('wraps the trigger in a heading, default h3 and configurable', () => {
    expect(mountAccordion().find('h3').exists()).toBe(true)

    const custom = mount(Accordion, {
      props: { modelValue: 'a' },
      slots: { default: () => h(AccordionItem, { value: 'a', title: 'A', headingLevel: 2 }) },
    })
    expect(custom.find('h2').exists()).toBe(true)
    expect(custom.find('h3').exists()).toBe(false)
  })
})
