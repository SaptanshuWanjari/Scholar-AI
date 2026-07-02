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

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PrerequisiteCard</h2>
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

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
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

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PrerequisiteCard — item statuses</h2>
      <div className="flex flex-wrap gap-4">
        <div className="max-w-xs">
          <h3 className="font-serif text-base font-bold mb-2">Mixed statuses</h3>
          <PrerequisiteCard
            title="Prerequisites"
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
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PrerequisiteCard — all done</h2>
      <div className="max-w-xs">
        <PrerequisiteCard
          title="All Done"
          items={[
            { title: 'Linear Algebra', mastery: 'mastered', done: true },
            { title: 'Calculus', mastery: 'mastered', done: true },
            { title: 'Probability', mastery: 'learning', done: true },
          ]}
        />
      </div>

      <h2 className="font-serif text-xl font-bold mt-6">PrerequisiteCard — all pending</h2>
      <div className="max-w-xs">
        <PrerequisiteCard
          title="All Pending"
          items={[
            { title: 'Linear Algebra', mastery: 'learning', done: false },
            { title: 'Calculus', mastery: 'weak', done: false },
            { title: 'Probability', mastery: 'unknown', done: false },
          ]}
        />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
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
