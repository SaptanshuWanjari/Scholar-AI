import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StickyNoteCard } from '@paper-ui/components/cards'

const meta: Meta<typeof StickyNoteCard> = {
  title: 'Components/Cards/StickyNoteCard',
  component: StickyNoteCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof StickyNoteCard>

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-8 items-start pt-4">
        {(['yellow', 'pink', 'blue', 'green', 'orange', 'purple'] as const).map((color, i) => (
          <StickyNoteCard
            key={color}
            color={color}
            title="Quick note"
            rotate={i % 2 === 0 ? -2 : 2}
            pin={i % 3 === 0 ? 'push-pin' : i % 3 === 1 ? 'tape' : 'none'}
            className="w-44"
          >
            <p className="font-kalam text-sm mt-2">Review {color} topics before the exam!</p>
          </StickyNoteCard>
        ))}
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-8 items-start pt-4">
        <StickyNoteCard color="yellow" title="Push-pin" pin="push-pin" rotate={-2} className="w-44">
          <p className="font-kalam text-sm mt-2">Pinned with a push-pin.</p>
        </StickyNoteCard>
        <StickyNoteCard color="pink" title="Tape" pin="tape" rotate={2} className="w-44">
          <p className="font-kalam text-sm mt-2">Taped to the board.</p>
        </StickyNoteCard>
        <StickyNoteCard color="blue" title="No pin" pin="none" rotate={-2} className="w-44">
          <p className="font-kalam text-sm mt-2">Just a loose sticky note.</p>
        </StickyNoteCard>
      </div>
    </div>
  ),
}
