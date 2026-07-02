import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LearningPathCard } from '@paper-ui/components/cards'

const meta: Meta<typeof LearningPathCard> = {
  title: 'Components/Cards/LearningPathCard',
  component: LearningPathCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof LearningPathCard>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="max-w-xs">
        <LearningPathCard
          title="Deep Learning Foundations"
          description="A structured path from linear algebra to neural networks."
          progress={40}
          steps={[
            { title: 'Linear Algebra Basics', status: 'done', estimatedTime: '3h' },
            { title: 'Calculus & Optimization', status: 'done', estimatedTime: '4h' },
            { title: 'Neural Network Intro', status: 'active', estimatedTime: '5h' },
            { title: 'Backpropagation', status: 'pending', estimatedTime: '4h' },
            { title: 'CNNs & RNNs', status: 'pending', estimatedTime: '6h' },
          ]}
          onContinue={() => {}}
        />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-col gap-8">
        <div className="max-w-xs">
          <h3 className="text-sm font-semibold mb-2 text-ink-muted">0% progress</h3>
          <LearningPathCard
            title="Deep Learning Foundations"
            description="A structured path from linear algebra to neural networks."
            progress={0}
            steps={[
              { title: 'Linear Algebra Basics', status: 'pending', estimatedTime: '3h' },
              { title: 'Calculus & Optimization', status: 'pending', estimatedTime: '4h' },
              { title: 'Neural Network Intro', status: 'pending', estimatedTime: '5h' },
              { title: 'Backpropagation', status: 'pending', estimatedTime: '4h' },
              { title: 'CNNs & RNNs', status: 'pending', estimatedTime: '6h' },
            ]}
            onContinue={() => {}}
          />
        </div>
        <div className="max-w-xs">
          <h3 className="text-sm font-semibold mb-2 text-ink-muted">50% progress</h3>
          <LearningPathCard
            title="Deep Learning Foundations"
            description="A structured path from linear algebra to neural networks."
            progress={50}
            steps={[
              { title: 'Linear Algebra Basics', status: 'done', estimatedTime: '3h' },
              { title: 'Calculus & Optimization', status: 'done', estimatedTime: '4h' },
              { title: 'Neural Network Intro', status: 'active', estimatedTime: '5h' },
              { title: 'Backpropagation', status: 'pending', estimatedTime: '4h' },
            ]}
            onContinue={() => {}}
          />
        </div>
        <div className="max-w-xs">
          <h3 className="text-sm font-semibold mb-2 text-ink-muted">100% progress</h3>
          <LearningPathCard
            title="Deep Learning Foundations"
            description="A structured path from linear algebra to neural networks."
            progress={100}
            steps={[
              { title: 'Linear Algebra Basics', status: 'done', estimatedTime: '3h' },
              { title: 'Calculus & Optimization', status: 'done', estimatedTime: '4h' },
              { title: 'Neural Network Intro', status: 'done', estimatedTime: '5h' },
              { title: 'Backpropagation', status: 'done', estimatedTime: '4h' },
              { title: 'CNNs & RNNs', status: 'done', estimatedTime: '6h' },
            ]}
            onContinue={() => {}}
          />
        </div>
      </div>
    </div>
  ),
}
