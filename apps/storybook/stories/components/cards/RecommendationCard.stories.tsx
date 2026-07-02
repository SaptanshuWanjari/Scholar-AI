import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecommendationCard } from '@paper-ui/components/cards'
import { Brain, Zap } from 'lucide-react'

const meta: Meta<typeof RecommendationCard> = {
  title: 'Components/Cards/RecommendationCard',
  component: RecommendationCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RecommendationCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <RecommendationCard
        title="Review Linear Algebra"
        description="You haven't reviewed this in 10 days."
        icon={<Brain size={20} />}
        tone="lavender"
        className="max-w-sm"
      />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <RecommendationCard
        title="Start Quiz"
        description="You've mastered 85% of the material."
        reason="Based on your progress"
        actionLabel="Take Quiz"
        icon={<Zap size={20} />}
        tone="ochre"
        onAction={() => alert('Starting quiz')}
        onDismiss={() => alert('Dismissed')}
        className="max-w-sm"
      />
    </div>
  ),
}

export const WithDismiss: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <RecommendationCard
        title="Chapter 3 Review"
        description="A quick review will strengthen your retention."
        reason="Based on spaced repetition schedule"
        actionLabel="Start Review"
        icon={<Brain size={20} />}
        tone="lavender"
        onAction={() => {}}
        onDismiss={() => {}}
        className="max-w-sm"
      />
      <RecommendationCard
        title="Practice Problems"
        description="Ready for a challenge? Try these advanced problems."
        actionLabel="Solve"
        icon={<Zap size={20} />}
        tone="ochre"
        onAction={() => {}}
        className="max-w-sm"
      />
    </div>
  ),
}
