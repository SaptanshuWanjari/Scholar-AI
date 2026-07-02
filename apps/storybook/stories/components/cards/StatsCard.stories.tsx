import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatsCard } from '@paper-ui/components/cards'
import { Brain, BookOpen, Zap } from 'lucide-react'

const meta: Meta<typeof StatsCard> = {
  title: 'Components/Cards/StatsCard',
  component: StatsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof StatsCard>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="max-w-sm">
        <StatsCard
          title="This Week"
          stats={[
            { icon: <BookOpen size={16} />, tone: 'sage', label: 'Documents', sublabel: 'Indexed', value: '24' },
            { icon: <Brain size={16} />, tone: 'lavender', label: 'Concepts', sublabel: 'Mastered', value: '138' },
            { icon: <Zap size={16} />, tone: 'ochre', label: 'Study Time', value: '12h' },
          ]}
        />
      </div>
    </div>
  ),
}
