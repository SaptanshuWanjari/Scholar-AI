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

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">QuizRecommendation</h2>
      <div className="flex flex-wrap gap-4">
        <QuizRecommendation
          title="ML Fundamentals Check"
          questionCount={15}
          difficulty="Medium"
          badge={<DifficultyBadge difficulty="Medium" />}
          reason="You haven't reviewed this topic in 7 days."
          onStart={() => console.log('start quiz')}
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
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <QuizRecommendation
        title="ML Fundamentals Check"
        questionCount={15}
        difficulty="Medium"
        reason="You haven't reviewed this topic in 7 days."
        onStart={() => console.log('start quiz')}
        className="max-w-xs"
      />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">QuizRecommendation — difficulty levels</h2>
      <div className="flex flex-wrap gap-4">
        {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
          <QuizRecommendation
            key={diff}
            title={`${diff} Quiz`}
            questionCount={diff === 'Easy' ? 5 : diff === 'Medium' ? 15 : 25}
            difficulty={diff}
            badge={<DifficultyBadge difficulty={diff} />}
            reason={`A ${diff.toLowerCase()} difficulty quiz to test your knowledge.`}
            onStart={() => {}}
            className="max-w-xs"
          />
        ))}
      </div>

      <h2 className="font-serif text-xl font-bold mt-6">QuizRecommendation — question counts</h2>
      <div className="flex flex-wrap gap-4">
        <QuizRecommendation
          title="Quick Check"
          questionCount={5}
          difficulty="Easy"
          reason="A quick refresher quiz."
          onStart={() => {}}
          className="max-w-xs"
        />
        <QuizRecommendation
          title="Comprehensive Exam"
          questionCount={50}
          difficulty="Hard"
          reason="Full topic coverage assessment."
          onStart={() => {}}
          className="max-w-xs"
        />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-4">
        <QuizRecommendation
          title="With Reason"
          questionCount={15}
          difficulty="Medium"
          reason="You haven't reviewed this topic in 7 days."
          onStart={() => console.log('start quiz')}
          className="max-w-xs"
        />
        <QuizRecommendation
          title="No Reason"
          questionCount={10}
          difficulty="Easy"
          onStart={() => {}}
          className="max-w-xs"
        />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">QuizRecommendation — with DifficultyBadge</h2>
      <div className="flex flex-wrap gap-4">
        <QuizRecommendation
          title="ML Fundamentals Check"
          questionCount={15}
          difficulty="Medium"
          badge={<DifficultyBadge difficulty="Medium" />}
          reason="You haven't reviewed this topic in 7 days."
          onStart={() => console.log('start quiz')}
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
    </div>
  ),
}
