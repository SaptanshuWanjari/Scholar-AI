import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MetricCard } from '@paper-ui/components/cards'
import { Brain, BookOpen, FileText } from 'lucide-react'

const meta: Meta<typeof MetricCard> = {
  title: 'Components/Cards/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MetricCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <MetricCard
        label="Concepts Mastered"
        value={138}
        unit="concepts"
        icon={<Brain size={20} />}
        tone="lavender"
        className="w-56"
      />
    </div>
  ),
}

export const WithTrend: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <MetricCard
        label="Study Time"
        value="12h"
        unit="this week"
        trend={3}
        icon={<BookOpen size={20} />}
        tone="ochre"
        className="w-56"
      />
      <MetricCard
        label="Quiz Score"
        value="87%"
        trend={-2}
        icon={<Brain size={20} />}
        tone="brick"
        className="w-56"
      />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <MetricCard
        label="Mastered"
        value={42}
        unit="concepts"
        trend={8}
        icon={<Brain size={20} />}
        tone="lavender"
        className="w-56"
      />
      <MetricCard
        label="Study Time"
        value="24h"
        unit="this week"
        trend={3}
        icon={<BookOpen size={20} />}
        tone="ochre"
        className="w-56"
      />
      <MetricCard
        label="Documents"
        value={18}
        unit="indexed"
        trend={0}
        icon={<FileText size={20} />}
        tone="sky"
        className="w-56"
      />
      <MetricCard
        label="Quiz Average"
        value="84%"
        trend={-2}
        icon={<Brain size={20} />}
        tone="brick"
        className="w-56"
      />
    </div>
  ),
}
