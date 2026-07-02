import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StickyNoteCard } from '@paper-ui/components/cards'

const meta: Meta<typeof StickyNoteCard> = {
  title: 'Components/Cards/StickyNoteCard',
  component: StickyNoteCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StickyNoteCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap pt-12">
      <StickyNoteCard color="yellow" pin="push-pin" rotate={-2} className="w-48">
        <p>Remember: Review Chapter 3 before exam!</p>
      </StickyNoteCard>
    </div>
  ),
}

export const AllColors: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap pt-12">
      {(['yellow', 'pink', 'blue', 'green', 'orange', 'purple'] as const).map((color, i) => (
        <StickyNoteCard
          key={color}
          color={color}
          rotate={i % 2 === 0 ? -2 : 2}
          pin={i % 3 === 0 ? 'push-pin' : i % 3 === 1 ? 'tape' : 'none'}
          className="w-44"
        >
          <p className="text-sm">Notes in {color}</p>
        </StickyNoteCard>
      ))}
    </div>
  ),
}

export const WithContent: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap pt-12">
      <StickyNoteCard
        color="yellow"
        title="Study Tips"
        pin="push-pin"
        rotate={-2}
        tags={['Learning']}
        className="w-56"
      >
        <p>Focus on core concepts first, then dive into details.</p>
      </StickyNoteCard>
      <StickyNoteCard
        color="pink"
        title="To Review"
        pin="tape"
        rotate={1}
        footer="Updated 2h ago"
        className="w-56"
      >
        <p>Eigenvalues and eigenvectors. Linear transformations.</p>
      </StickyNoteCard>
      <StickyNoteCard
        color="blue"
        title="Quick Note"
        pin="none"
        rotate={-1}
        className="w-56"
      >
        <p>Backpropagation intuition: chain rule applied to networks.</p>
      </StickyNoteCard>
    </div>
  ),
}
