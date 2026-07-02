import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { KnowledgeNode } from '@paper-ui/components/teaching'
import { DifficultyBadge, CourseTag } from '@paper-ui/components/badges'
import { SketchButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof KnowledgeNode> = {
  title: 'Components/Teaching/KnowledgeNode',
  component: KnowledgeNode,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof KnowledgeNode>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <KnowledgeNode
        title="Backpropagation"
        summary="Algorithm for computing gradients by propagating errors backward through layers."
        mastery="learning"
        className="w-72"
      />
    </div>
  ),
}

export const MasteryLevels: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex flex-wrap gap-4">
      {(['mastered', 'learning', 'weak', 'unknown'] as const).map(mastery => (
        <KnowledgeNode
          key={mastery}
          title={`${mastery.charAt(0).toUpperCase() + mastery.slice(1)} Node`}
          summary={`A ${mastery} concept in the knowledge graph.`}
          mastery={mastery}
          className="w-64"
        />
      ))}
    </div>
  ),
}

export const WithTagsAndStats: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <KnowledgeNode
        title="Backpropagation"
        summary="Algorithm for computing gradients by propagating errors backward through layers."
        mastery="learning"
        tags={[
          <CourseTag key="ml" course="ML" />,
          <DifficultyBadge key="d" difficulty="Hard" />,
        ]}
        stats={[
          { label: 'Sources', value: '8' },
          { label: 'Flashcards', value: '14' },
          { label: 'Reviews', value: '5' },
        ]}
        actions={<SketchButton size="sm">Review</SketchButton>}
        className="w-72"
      />
    </div>
  ),
}
