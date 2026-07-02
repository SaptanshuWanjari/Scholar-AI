import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PrerequisiteCard } from '@paper-ui/components/teaching'

const meta: Meta<typeof PrerequisiteCard> = {
  title: 'Components/Teaching/PrerequisiteCard',
  component: PrerequisiteCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PrerequisiteCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="max-w-xs">
        <PrerequisiteCard
          title="Prerequisites for Backpropagation"
          items={[
            { title: 'Linear Algebra', mastery: 'mastered', done: true },
            { title: 'Calculus', mastery: 'mastered', done: true },
            { title: 'Chain Rule', mastery: 'learning', done: false },
          ]}
        />
      </div>
    </div>
  ),
}

export const Mixed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="max-w-xs">
        <PrerequisiteCard
          title="Prerequisites for Backpropagation"
          items={[
            { title: 'Linear Algebra', mastery: 'mastered', done: true },
            { title: 'Calculus', mastery: 'mastered', done: true },
            { title: 'Chain Rule', mastery: 'learning', done: false },
            { title: 'Neural Networks Basics', mastery: 'weak', done: false },
            { title: 'Gradient Descent', mastery: 'unknown', done: false },
          ]}
        />
      </div>
    </div>
  ),
}

export const AllDone: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="max-w-xs">
        <PrerequisiteCard
          title="Ready to start"
          items={[
            { title: 'Linear Algebra', mastery: 'mastered', done: true },
            { title: 'Calculus', mastery: 'mastered', done: true },
            { title: 'Probability', mastery: 'learning', done: true },
          ]}
        />
      </div>
    </div>
  ),
}
