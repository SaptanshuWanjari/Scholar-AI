import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SessionCard } from '@paper-ui/components/cards'

const meta: Meta<typeof SessionCard> = {
  title: 'Components/Cards/SessionCard',
  component: SessionCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SessionCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <div className="max-w-sm">
        <SessionCard
          title="Recent Sessions"
          sessions={[
            { text: 'Machine Learning', subtext: 'Chapter 4', duration: '45 min', ago: '2h ago' },
            { text: 'Linear Algebra Review', subtext: 'Eigenvectors', duration: '30 min', ago: 'Yesterday' },
            { text: 'Flashcard Drill', duration: '12 min', ago: '2 days ago' },
          ]}
          onViewAll={() => alert('View all')}
        />
      </div>
    </div>
  ),
}

export const SingleSession: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <div className="max-w-sm">
        <SessionCard
          title="Today"
          sessions={[
            { text: 'Quick Flashcard Drill', duration: '12 min', ago: '2h ago' },
          ]}
          onViewAll={() => {}}
        />
      </div>
    </div>
  ),
}

export const MultipleRows: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <div className="max-w-sm">
        <SessionCard
          title="This Week"
          sessions={[
            { text: 'Machine Learning Study', subtext: 'Deep Learning fundamentals', duration: '1h', ago: 'Today' },
            { text: 'Operating Systems', subtext: 'Process scheduling', duration: '45 min', ago: 'Yesterday' },
            { text: 'Data Structures', subtext: 'Tree algorithms', duration: '30 min', ago: '2 days ago' },
            { text: 'Discrete Math', duration: '20 min', ago: '3 days ago' },
          ]}
          onViewAll={() => {}}
        />
      </div>
    </div>
  ),
}
