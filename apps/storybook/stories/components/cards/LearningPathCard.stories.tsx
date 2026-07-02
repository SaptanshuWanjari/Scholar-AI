import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LearningPathCard } from '@paper-ui/components/cards'

const meta: Meta<typeof LearningPathCard> = {
  title: 'Components/Cards/LearningPathCard',
  component: LearningPathCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LearningPathCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <LearningPathCard
        title="Machine Learning Path"
        steps={[
          { id: '1', label: 'Linear Algebra Basics', completed: true },
          { id: '2', label: 'Calculus & Optimization', completed: true },
          { id: '3', label: 'Neural Networks', current: true },
          { id: '4', label: 'Backpropagation' },
        ]}
        completedCount={2}
        totalCount={4}
        className="w-72"
      />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <LearningPathCard
        title="Python Fundamentals"
        steps={[
          { id: '1', label: 'Syntax Basics', completed: true },
          { id: '2', label: 'Data Types', current: true, description: 'Learn lists, dicts, tuples' },
          { id: '3', label: 'Functions' },
          { id: '4', label: 'Classes & OOP' },
        ]}
        completedCount={1}
        totalCount={4}
        onContinue={() => alert('Continue learning')}
        className="w-72"
      />
    </div>
  ),
}

export const PartialProgress: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <LearningPathCard
        title="Deep Learning"
        steps={[
          { id: '1', label: 'Foundations', completed: true },
          { id: '2', label: 'CNNs', completed: true },
          { id: '3', label: 'RNNs', completed: true },
          { id: '4', label: 'Transformers', current: true },
          { id: '5', label: 'Advanced Topics' },
        ]}
        completedCount={3}
        totalCount={5}
        className="w-72"
      />
    </div>
  ),
}
