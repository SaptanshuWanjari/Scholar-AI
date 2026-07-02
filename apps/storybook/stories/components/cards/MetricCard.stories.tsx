import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MetricCard } from '@paper-ui/components/cards'
import { Brain, BookOpen, FileText } from 'lucide-react'

const meta: Meta<typeof MetricCard> = {
  title: 'Components/Cards/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof MetricCard>

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        <MetricCard
          label="Concepts Mastered"
          value={138}
          unit="concepts"
          trend={12}
          trendLabel="+12 this week"
          icon={<Brain size={20} />}
          tone="lavender"
          className="w-52"
        />
        <MetricCard
          label="Study Time"
          value="12h"
          unit="this week"
          trend={3}
          trendLabel="+3h vs last week"
          icon={<BookOpen size={20} />}
          tone="ochre"
          className="w-52"
        />
        <MetricCard
          label="Documents"
          value={24}
          unit="indexed"
          trend={0}
          trendLabel="No change"
          icon={<FileText size={20} />}
          tone="sky"
          className="w-52"
        />
        <MetricCard
          label="Quiz Score"
          value="87%"
          description="Average across 12 quizzes"
          trend={-2}
          trendLabel="-2% vs last week"
          tone="brick"
          className="w-52"
        />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        <MetricCard
          label="Concepts Mastered"
          value={138}
          unit="concepts"
          trend={12}
          trendLabel="+12 this week"
          icon={<Brain size={20} />}
          tone="lavender"
          className="w-52"
        />
        <MetricCard
          label="Study Time"
          value="12h"
          unit="this week"
          trend={3}
          trendLabel="+3h vs last week"
          icon={<BookOpen size={20} />}
          tone="ochre"
          className="w-52"
        />
        <MetricCard
          label="Documents"
          value={24}
          unit="indexed"
          trend={0}
          trendLabel="No change"
          icon={<FileText size={20} />}
          tone="sky"
          className="w-52"
        />
        <MetricCard
          label="Quiz Score"
          value="87%"
          description="Average across 12 quizzes"
          trend={-2}
          trendLabel="-2% vs last week"
          tone="brick"
          className="w-52"
        />
      </div>
    </div>
  ),
}
