import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PinnedCard } from '@paper-ui/components/cards'

const meta: Meta<typeof PinnedCard> = {
  title: 'Components/Cards/PinnedCard',
  component: PinnedCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PinnedCard>

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-8 items-start pt-6">
        <PinnedCard title="Important Note" pinStyle="push-pin" rotate={-2} className="w-56">
          <p className="font-kalam text-sm text-ink-muted mt-2">
            Remember to review backpropagation before the exam tomorrow.
          </p>
        </PinnedCard>
        <PinnedCard title="To-do" pinStyle="tape" rotate={1.5} className="w-56">
          <ul className="font-kalam text-sm text-ink-muted mt-2 space-y-1">
            <li>✓ Read Chapter 4</li>
            <li>□ Watch lecture</li>
            <li>□ Practice problems</li>
          </ul>
        </PinnedCard>
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-8 items-start pt-6">
        <PinnedCard title="Important Note" pinStyle="push-pin" rotate={-2} className="w-56">
          <p className="font-kalam text-sm text-ink-muted mt-2">
            Remember to review backpropagation before the exam tomorrow.
          </p>
        </PinnedCard>
        <PinnedCard title="To-do" pinStyle="tape" rotate={1.5} className="w-56">
          <ul className="font-kalam text-sm text-ink-muted mt-2 space-y-1">
            <li>✓ Read Chapter 4</li>
            <li>□ Watch lecture</li>
            <li>□ Practice problems</li>
          </ul>
        </PinnedCard>
      </div>
    </div>
  ),
}
