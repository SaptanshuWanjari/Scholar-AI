import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecommendationCard } from '@paper-ui/components/cards'
import { Brain, Zap } from 'lucide-react'

const meta: Meta<typeof RecommendationCard> = {
  title: 'Components/Cards/RecommendationCard',
  component: RecommendationCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof RecommendationCard>

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        <RecommendationCard
          title="Review Backpropagation"
          description="You haven't practiced this concept in 14 days. A quick review will strengthen retention."
          reason="Based on your spaced repetition schedule"
          actionLabel="Start Review"
          icon={<Brain size={20} />}
          tone="lavender"
          onAction={() => {}}
          onDismiss={() => {}}
          className="max-w-xs"
        />
        <RecommendationCard
          title="Try the ML Quiz"
          description="You've mastered 85% of the course material — you're ready for a challenge."
          reason="AI-generated based on your progress"
          actionLabel="Take Quiz"
          icon={<Zap size={20} />}
          tone="ochre"
          onAction={() => {}}
          className="max-w-xs"
        />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        <RecommendationCard
          title="Review Backpropagation"
          description="You haven't practiced this concept in 14 days. A quick review will strengthen retention."
          reason="Based on your spaced repetition schedule"
          actionLabel="Start Review"
          icon={<Brain size={20} />}
          tone="lavender"
          onAction={() => {}}
          onDismiss={() => {}}
          className="max-w-xs"
        />
        <RecommendationCard
          title="Try the ML Quiz"
          description="You've mastered 85% of the course material — you're ready for a challenge."
          reason="AI-generated based on your progress"
          actionLabel="Take Quiz"
          icon={<Zap size={20} />}
          tone="ochre"
          onAction={() => {}}
          className="max-w-xs"
        />
      </div>
    </div>
  ),
}
