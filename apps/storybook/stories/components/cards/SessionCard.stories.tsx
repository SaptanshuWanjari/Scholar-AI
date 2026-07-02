import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SessionCard } from '@paper-ui/components/cards'

const meta: Meta<typeof SessionCard> = {
  title: 'Components/Cards/SessionCard',
  component: SessionCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof SessionCard>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="max-w-sm">
        <SessionCard
          title="Recent Sessions"
          sessions={[
            { text: 'Machine Learning Fundamentals', subtext: 'Chapter 4 — Backpropagation', duration: '45 min', ago: '2h ago' },
            { text: 'Linear Algebra Review', subtext: 'Eigenvectors & eigenvalues', duration: '30 min', ago: 'Yesterday' },
            { text: 'Quick Flashcard Drill', duration: '12 min', ago: '2 days ago' },
          ]}
          onViewAll={() => {}}
        />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-col gap-6">
        <div className="max-w-sm">
          <h3 className="text-sm font-semibold mb-2 text-ink-muted">Fewer sessions</h3>
          <SessionCard
            title="Today"
            sessions={[
              { text: 'Quick Flashcard Drill', duration: '12 min', ago: '2h ago' },
            ]}
            onViewAll={() => {}}
          />
        </div>
        <div className="max-w-sm">
          <h3 className="text-sm font-semibold mb-2 text-ink-muted">Empty state</h3>
          <SessionCard
            title="Recent Sessions"
            sessions={[]}
          />
        </div>
      </div>
    </div>
  ),
}
