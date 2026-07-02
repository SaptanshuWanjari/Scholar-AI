import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConceptCard } from '@paper-ui/components/cards'
import { DifficultyBadge } from '@paper-ui/components/badges'

const meta: Meta<typeof ConceptCard> = {
  title: 'Components/Cards/ConceptCard',
  component: ConceptCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ConceptCard>

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        {(['mastered', 'learning', 'weak', 'unknown'] as const).map(mastery => (
          <ConceptCard
            key={mastery}
            title="Gradient Descent"
            description="Optimization algorithm that moves in the direction of the negative gradient to minimize a loss function."
            mastery={mastery}
            sourceCount={8}
            flashcardCount={12}
            badge={<DifficultyBadge difficulty="Medium" />}
            onStudy={() => {}}
            className="w-60"
          />
        ))}
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        {(['mastered', 'learning', 'weak'] as const).map(mastery => (
          <ConceptCard
            key={mastery}
            title="Gradient Descent"
            description="Optimization algorithm that moves in the direction of the negative gradient to minimize a loss function."
            mastery={mastery}
            sourceCount={8}
            flashcardCount={12}
            badge={<DifficultyBadge difficulty="Medium" />}
            onStudy={() => {}}
            className="w-60"
          />
        ))}
      </div>
    </div>
  ),
}
