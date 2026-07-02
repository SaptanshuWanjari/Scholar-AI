import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MasteryFilterGroup } from '@paper-ui/components/teaching'

const meta: Meta<typeof MasteryFilterGroup> = {
  title: 'Components/Teaching/MasteryFilterGroup',
  component: MasteryFilterGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof MasteryFilterGroup>

export const Playground: Story = {
  render: () => {
    const [items, setItems] = useState([
      { level: 'all' as const, label: 'All', count: 42, active: true },
      { level: 'mastered' as const, label: 'Mastered', count: 17, active: false },
      { level: 'learning' as const, label: 'Learning', count: 15, active: false },
      { level: 'weak' as const, label: 'Weak', count: 7, active: false },
      { level: 'unknown' as const, label: 'Unknown', count: 3, active: false },
    ])

    return (
      <div className="p-10 space-y-6 bg-[#f4f1ea]">
        <h2 className="font-serif text-xl font-bold">MasteryFilterGroup</h2>
        <div className="w-48 bg-white/60 rounded-xl p-3">
          <MasteryFilterGroup
            items={items}
            onChange={(level, active) =>
              setItems(prev => prev.map(i => i.level === level ? { ...i, active } : i))
            }
          />
        </div>
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="w-48 bg-white/60 rounded-xl p-3">
        <MasteryFilterGroup
          items={[
            { level: 'all' as const, label: 'All', count: 42, active: true },
            { level: 'mastered' as const, label: 'Mastered', count: 17, active: false },
            { level: 'learning' as const, label: 'Learning', count: 15, active: false },
          ]}
        />
      </div>
    </div>
  ),
}

export const Variants: Story = {
  render: () => {
    const [items, setItems] = useState([
      { level: 'all' as const, label: 'All', count: 42, active: true },
      { level: 'mastered' as const, label: 'Mastered', count: 17, active: false },
      { level: 'learning' as const, label: 'Learning', count: 15, active: false },
      { level: 'weak' as const, label: 'Weak', count: 7, active: false },
      { level: 'unknown' as const, label: 'Unknown', count: 3, active: false },
    ])

    return (
      <div className="p-10 space-y-6 bg-[#f4f1ea]">
        <h2 className="font-serif text-xl font-bold">MasteryFilterGroup — multi-select</h2>
        <div className="w-48 bg-white/60 rounded-xl p-3">
          <MasteryFilterGroup
            items={items}
            onChange={(level, active) =>
              setItems(prev => prev.map(i => i.level === level ? { ...i, active } : i))
            }
          />
        </div>
      </div>
    )
  },
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">MasteryFilterGroup — all active</h2>
      <div className="w-48 bg-white/60 rounded-xl p-3">
        <MasteryFilterGroup
          items={[
            { level: 'all' as const, label: 'All', count: 42, active: true },
            { level: 'mastered' as const, label: 'Mastered', count: 17, active: true },
            { level: 'learning' as const, label: 'Learning', count: 15, active: true },
          ]}
        />
      </div>

      <h2 className="font-serif text-xl font-bold mt-6">MasteryFilterGroup — none active</h2>
      <div className="w-48 bg-white/60 rounded-xl p-3">
        <MasteryFilterGroup
          items={[
            { level: 'all' as const, label: 'All', count: 42, active: false },
            { level: 'mastered' as const, label: 'Mastered', count: 17, active: false },
            { level: 'learning' as const, label: 'Learning', count: 15, active: false },
            { level: 'weak' as const, label: 'Weak', count: 7, active: false },
            { level: 'unknown' as const, label: 'Unknown', count: 3, active: false },
          ]}
        />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => {
    const [items, setItems] = useState([
      { level: 'all' as const, label: 'All', count: 42, active: true },
      { level: 'mastered' as const, label: 'Mastered', count: 17, active: false },
      { level: 'learning' as const, label: 'Learning', count: 15, active: false },
      { level: 'weak' as const, label: 'Weak', count: 7, active: false },
      { level: 'unknown' as const, label: 'Unknown', count: 3, active: false },
    ])

    return (
      <div className="p-10 space-y-6 bg-[#f4f1ea]">
        <h2 className="font-serif text-xl font-bold">MasteryFilterGroup — in card</h2>
        <div className="w-56 bg-white rounded-xl shadow-sm p-4">
          <p className="font-architect text-[11px] uppercase tracking-wider text-ink-muted mb-2">
            Concepts
          </p>
          <MasteryFilterGroup
            items={items}
            onChange={(level, active) =>
              setItems(prev => prev.map(i => i.level === level ? { ...i, active } : i))
            }
          />
          <p className="font-kalam text-xs text-ink-muted mt-3">
            {items.filter(i => i.active).length} filter{items.filter(i => i.active).length !== 1 ? 's' : ''} active
          </p>
        </div>
      </div>
    )
  },
}
