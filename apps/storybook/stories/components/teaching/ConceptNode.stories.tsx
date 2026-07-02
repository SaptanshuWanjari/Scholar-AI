import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConceptNode } from '@paper-ui/components/teaching'
import { DifficultyBadge } from '@paper-ui/components/badges'
import { SketchButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof ConceptNode> = {
  title: 'Components/Teaching/ConceptNode',
  component: ConceptNode,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ConceptNode>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <ConceptNode
        title="Gradient Descent"
        description="Optimization algorithm that moves in the direction of the negative gradient to minimize loss."
        mastery="learning"
        meta="12 sources"
        className="max-w-xs"
      />
    </div>
  ),
}

export const MasteryLevels: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex flex-wrap gap-4">
      {(['mastered', 'learning', 'weak', 'unknown'] as const).map(mastery => (
        <ConceptNode
          key={mastery}
          title={`${mastery.charAt(0).toUpperCase() + mastery.slice(1)} Concept`}
          description="A fundamental idea in the domain that builds on previous knowledge."
          mastery={mastery}
          badge={<DifficultyBadge difficulty="Medium" />}
          meta="8 sources"
          className="max-w-[220px] w-full"
        />
      ))}
    </div>
  ),
}

export const WithActions: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <ConceptNode
        title="Gradient Descent"
        description="Optimization algorithm that moves in the direction of the negative gradient to minimize loss."
        mastery="learning"
        badge={<DifficultyBadge difficulty="Medium" />}
        meta="12 sources"
        actions={<SketchButton size="sm">Study</SketchButton>}
        onClick={() => {}}
        className="max-w-xs"
      />
    </div>
  ),
}
