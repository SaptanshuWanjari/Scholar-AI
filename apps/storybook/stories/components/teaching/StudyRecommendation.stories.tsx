import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StudyRecommendation } from '@paper-ui/components/teaching'
import { CourseTag } from '@paper-ui/components/badges'

const meta: Meta<typeof StudyRecommendation> = {
  title: 'Components/Teaching/StudyRecommendation',
  component: StudyRecommendation,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof StudyRecommendation>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <StudyRecommendation
        type="read"
        title="Read: Attention Mechanism"
        source="Attention Is All You Need (2017)"
        estimatedTime="25 min"
        reason="Weak on this concept — review recommended."
        actionLabel="Open PDF"
        onAction={() => {}}
        className="max-w-xs"
      />
    </div>
  ),
}

export const ActivityTypes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex flex-wrap gap-4">
      <StudyRecommendation type="read" title="Read: Attention Mechanism" source="Attention Is All You Need (2017)" estimatedTime="25 min" reason="Weak on this concept." actionLabel="Open PDF" onAction={() => {}} className="max-w-xs" />
      <StudyRecommendation type="review" title="Review: Neural Networks" source="Deep Learning Book — Chapter 6" estimatedTime="40 min" reason="Last reviewed 14 days ago." actionLabel="Review" onAction={() => {}} className="max-w-xs" />
      <StudyRecommendation type="practice" title="Practice: Gradient Descent" source="Exercise Set 4" estimatedTime="30 min" reason="Improve your weak area." actionLabel="Start" onAction={() => {}} className="max-w-xs" />
      <StudyRecommendation type="watch" title="Watch: Backpropagation Visualized" source="3Blue1Brown — Neural Networks" estimatedTime="20 min" reason="Visual reinforcement recommended." actionLabel="Watch Now" onAction={() => {}} className="max-w-xs" />
    </div>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex flex-wrap gap-4">
      {(['read', 'review', 'practice', 'watch'] as const).map(type => (
        <StudyRecommendation
          key={type}
          type={type}
          title={`${type.charAt(0).toUpperCase() + type.slice(1)}: Attention Mechanism`}
          source="Attention Is All You Need (2017)"
          estimatedTime="25 min"
          reason="Weak on this concept — review recommended."
          badge={<CourseTag course="ML" />}
          actionLabel={type === 'read' ? 'Open PDF' : type === 'watch' ? 'Watch Now' : 'Start'}
          onAction={() => {}}
          className="max-w-xs"
        />
      ))}
    </div>
  ),
}
