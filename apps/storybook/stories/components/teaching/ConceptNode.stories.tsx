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

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">ConceptNode — mastery levels</h2>
      <div className="flex flex-wrap gap-4">
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

      <div>
        <h3 className="font-serif text-base font-bold mt-6 mb-3">With actions</h3>
        <ConceptNode
          title="Gradient Descent"
          description="Optimization algorithm that moves in the direction of the negative gradient to minimize loss."
          mastery="learning"
          badge={<DifficultyBadge difficulty="Medium" />}
          meta="12 sources"
          actions={<SketchButton size="sm">Study</SketchButton>}
          onClick={() => console.log('clicked')}
          className="max-w-xs"
        />
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
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

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">ConceptNode — mastery levels</h2>
      <div className="flex flex-wrap gap-4">
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
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">ConceptNode — with actions vs without</h2>
      <div className="flex flex-col gap-4">
        <ConceptNode
          title="Gradient Descent"
          description="Optimization algorithm that moves in the direction of the negative gradient to minimize loss."
          mastery="learning"
          badge={<DifficultyBadge difficulty="Medium" />}
          meta="12 sources"
          actions={<SketchButton size="sm">Study</SketchButton>}
          onClick={() => console.log('clicked')}
          className="max-w-xs"
        />
        <ConceptNode
          title="Regularization"
          description="Technique to prevent overfitting by adding a penalty term to the loss function."
          mastery="weak"
          meta="5 sources"
          className="max-w-xs"
        />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">ConceptNode — with badge + actions</h2>
      <ConceptNode
        title="Gradient Descent"
        description="Optimization algorithm that moves in the direction of the negative gradient to minimize loss."
        mastery="learning"
        badge={<DifficultyBadge difficulty="Medium" />}
        meta="12 sources"
        actions={<SketchButton size="sm">Study</SketchButton>}
        onClick={() => console.log('clicked')}
        className="max-w-xs"
      />
    </div>
  ),
}
