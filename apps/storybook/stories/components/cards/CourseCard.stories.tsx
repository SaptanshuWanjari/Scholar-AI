import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CourseCard } from '@paper-ui/components/cards'
import { Brain, Zap } from 'lucide-react'

const meta: Meta<typeof CourseCard> = {
  title: 'Components/Cards/CourseCard',
  component: CourseCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CourseCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <CourseCard
        title="Machine Learning"
        subject="AI & Data Science"
        icon={<Brain size={20} strokeWidth={1.6} />}
        tone="lavender"
        progress={68}
        documentCount={24}
        lastStudied="2h ago"
        className="w-64"
      />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <CourseCard
        title="Linear Algebra"
        subject="Mathematics"
        tone="sky"
        progress={100}
        documentCount={12}
        lastStudied="1h ago"
        onClick={() => alert('Course clicked')}
        onContinue={() => alert('Continue')}
        className="w-64"
      />
    </div>
  ),
}

export const WithTags: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <CourseCard
        title="Machine Learning"
        subject="AI & Data Science"
        icon={<Brain size={20} strokeWidth={1.6} />}
        tone="lavender"
        progress={68}
        documentCount={24}
        tags={['Neural Networks', 'Optimization']}
        className="w-64"
      />
      <CourseCard
        title="Data Structures"
        subject="Computer Science"
        icon={<Zap size={20} strokeWidth={1.6} />}
        tone="ochre"
        progress={20}
        documentCount={8}
        tags={['Trees', 'Graphs']}
        className="w-64"
      />
    </div>
  ),
}
