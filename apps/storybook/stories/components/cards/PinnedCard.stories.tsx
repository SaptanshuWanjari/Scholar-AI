import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PinnedCard } from '@paper-ui/components/cards'

const meta: Meta<typeof PinnedCard> = {
  title: 'Components/Cards/PinnedCard',
  component: PinnedCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PinnedCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap pt-12">
      <PinnedCard
        title="Study Reminder"
        pinStyle="push-pin"
        rotate={-2}
        className="w-56"
      >
        <p className="font-kalam text-sm text-ink-muted">
          Review gradient descent before quiz tomorrow.
        </p>
      </PinnedCard>
    </div>
  ),
}

export const WithTape: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap pt-12">
      <PinnedCard
        title="To Do"
        pinStyle="tape"
        rotate={1}
        className="w-56"
      >
        <ul className="font-kalam text-sm text-ink-muted space-y-2">
          <li>✓ Read Chapter 3</li>
          <li>□ Solve practice problems</li>
          <li>□ Complete quiz</li>
        </ul>
      </PinnedCard>
    </div>
  ),
}

export const AllPinStyles: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap pt-12">
      <PinnedCard
        title="Push Pin"
        pinStyle="push-pin"
        rotate={-3}
        className="w-56"
      >
        <p className="font-kalam text-sm text-ink-muted">
          Important: Exam is next week.
        </p>
      </PinnedCard>
      <PinnedCard
        title="With Tape"
        pinStyle="tape"
        rotate={2}
        className="w-56"
      >
        <p className="font-kalam text-sm text-ink-muted">
          Don't forget: Team study session Friday.
        </p>
      </PinnedCard>
      <PinnedCard
        title="No Pin"
        pinStyle="push-pin"
        rotate={-1}
        className="w-56"
      >
        <p className="font-kalam text-sm text-ink-muted">
          Quick notes about lecture content.
        </p>
      </PinnedCard>
    </div>
  ),
}
