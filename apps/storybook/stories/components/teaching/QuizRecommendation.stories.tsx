import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { QuizRecommendation } from '@paper-ui/components/teaching'
import { DifficultyBadge } from '@paper-ui/components/badges'

const meta: Meta<typeof QuizRecommendation> = {
  title: 'Components/Teaching/QuizRecommendation',
  component: QuizRecommendation,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof QuizRecommendation>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <QuizRecommendation
        title="ML Fundamentals Check"
        questionCount={15}
        difficulty="Medium"
        reason="You haven't reviewed this topic in 7 days."
        onStart={() => {}}
        className="max-w-xs"
      />
    </div>
  ),
}

export const Difficulties: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex flex-wrap gap-4">
      {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
        <QuizRecommendation
          key={diff}
          title={`${diff} Quiz`}
          questionCount={diff === 'Easy' ? 5 : diff === 'Medium' ? 15 : 25}
          difficulty={diff}
          badge={<DifficultyBadge difficulty={diff} />}
          reason={`A ${diff.toLowerCase()} difficulty quiz.`}
          onStart={() => {}}
          className="max-w-xs"
        />
      ))}
    </div>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex flex-wrap gap-4">
      <QuizRecommendation
        title="ML Fundamentals Check"
        questionCount={15}
        difficulty="Medium"
        badge={<DifficultyBadge difficulty="Medium" />}
        reason="You haven't reviewed this topic in 7 days."
        onStart={() => {}}
        className="max-w-xs"
      />
      <QuizRecommendation
        title="Linear Algebra Deep Dive"
        questionCount={25}
        difficulty="Hard"
        badge={<DifficultyBadge difficulty="Hard" />}
        reason="You're ready to advance — mastery at 85%."
        onStart={() => {}}
        className="max-w-xs"
      />
    </div>
  ),
}
