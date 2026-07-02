import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LearningStepCard } from '@paper-ui/components/teaching'
import { SketchButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof LearningStepCard> = {
  title: 'Components/Teaching/LearningStepCard',
  component: LearningStepCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof LearningStepCard>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-4 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">LearningStepCard</h2>
      <div className="max-w-sm space-y-3">
        <LearningStepCard
          step={1}
          title="Read the introduction"
          description="Start with Chapter 1 of the ML Fundamentals textbook."
          status="done"
          estimatedTime="20 min"
        />
        <LearningStepCard
          step={2}
          title="Watch the lecture video"
          description="Khan Academy: Neural Networks explained visually."
          status="active"
          estimatedTime="45 min"
          actions={<SketchButton size="sm">Open</SketchButton>}
          onClick={() => {}}
        />
        <LearningStepCard
          step={3}
          title="Practice with exercises"
          description="Complete the 10 backpropagation exercises in the workbook."
          status="pending"
          estimatedTime="30 min"
        />
        <LearningStepCard
          step={4}
          title="Take the quiz"
          description="Test your understanding with 15 multiple-choice questions."
          status="pending"
          estimatedTime="15 min"
        />
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="max-w-sm">
        <LearningStepCard
          step={1}
          title="Read the introduction"
          description="Start with Chapter 1 of the ML Fundamentals textbook."
          status="pending"
          estimatedTime="20 min"
        />
      </div>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-4 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">LearningStepCard — statuses</h2>
      <div className="max-w-sm space-y-3">
        <LearningStepCard
          step={1}
          title="Done step"
          description="This step has been completed."
          status="done"
          estimatedTime="20 min"
        />
        <LearningStepCard
          step={2}
          title="Active step"
          description="This is the current step."
          status="active"
          estimatedTime="45 min"
          actions={<SketchButton size="sm">Continue</SketchButton>}
        />
        <LearningStepCard
          step={3}
          title="Pending step"
          description="This step is not yet started."
          status="pending"
          estimatedTime="30 min"
        />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-4 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">LearningStepCard — with actions</h2>
      <div className="max-w-sm space-y-3">
        <LearningStepCard
          step={1}
          title="Watch the lecture video"
          description="Khan Academy: Neural Networks explained visually."
          status="active"
          estimatedTime="45 min"
          actions={<SketchButton size="sm">Open</SketchButton>}
          onClick={() => {}}
        />
      </div>

      <h2 className="font-serif text-xl font-bold mt-4">LearningStepCard — without actions</h2>
      <div className="max-w-sm">
        <LearningStepCard
          step={2}
          title="Take the quiz"
          description="Test your understanding with 15 multiple-choice questions."
          status="pending"
          estimatedTime="15 min"
        />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-4 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">LearningStepCard — learning path</h2>
      <div className="max-w-sm space-y-3">
        <LearningStepCard
          step={1}
          title="Read the introduction"
          description="Start with Chapter 1 of the ML Fundamentals textbook."
          status="done"
          estimatedTime="20 min"
        />
        <LearningStepCard
          step={2}
          title="Watch the lecture video"
          description="Khan Academy: Neural Networks explained visually."
          status="active"
          estimatedTime="45 min"
          actions={<SketchButton size="sm">Open</SketchButton>}
          onClick={() => {}}
        />
        <LearningStepCard
          step={3}
          title="Practice with exercises"
          description="Complete the 10 backpropagation exercises in the workbook."
          status="pending"
          estimatedTime="30 min"
        />
        <LearningStepCard
          step={4}
          title="Take the quiz"
          description="Test your understanding with 15 multiple-choice questions."
          status="pending"
          estimatedTime="15 min"
        />
      </div>
    </div>
  ),
}
