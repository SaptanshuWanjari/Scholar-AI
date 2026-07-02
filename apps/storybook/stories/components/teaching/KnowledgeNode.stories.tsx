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

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">KnowledgeNode</h2>
      <div className="flex flex-wrap gap-4">
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
        <KnowledgeNode
          title="Softmax Function"
          summary="Converts a vector of values into a probability distribution."
          mastery="mastered"
          tags={[<CourseTag key="ml" course="ML" />, <DifficultyBadge key="d" difficulty="Easy" />]}
          stats={[{ label: 'Sources', value: '4' }, { label: 'Flashcards', value: '6' }]}
          className="w-72"
        />
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <KnowledgeNode
        title="Backpropagation"
        summary="Algorithm for computing gradients by propagating errors backward through layers."
        mastery="learning"
        className="w-72"
      />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">KnowledgeNode — mastery levels</h2>
      <div className="flex flex-wrap gap-4">
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

      <h2 className="font-serif text-xl font-bold mt-6">KnowledgeNode — with/without tags</h2>
      <div className="flex flex-wrap gap-4">
        <KnowledgeNode
          title="With Tags"
          summary="This node has tags attached."
          mastery="learning"
          tags={[<CourseTag key="ml" course="ML" />]}
          className="w-64"
        />
        <KnowledgeNode
          title="Without Tags"
          summary="This node has no tags."
          mastery="learning"
          className="w-64"
        />
      </div>

      <h2 className="font-serif text-xl font-bold mt-6">KnowledgeNode — with/without stats</h2>
      <div className="flex flex-wrap gap-4">
        <KnowledgeNode
          title="With Stats"
          summary="This node has stats."
          mastery="mastered"
          stats={[{ label: 'Sources', value: '4' }, { label: 'Flashcards', value: '6' }]}
          className="w-64"
        />
        <KnowledgeNode
          title="Without Stats"
          summary="This node has no stats."
          mastery="mastered"
          className="w-64"
        />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">KnowledgeNode — with actions vs without</h2>
      <div className="flex flex-wrap gap-4">
        <KnowledgeNode
          title="With Actions"
          summary="This node has action buttons."
          mastery="learning"
          stats={[{ label: 'Sources', value: '8' }]}
          actions={<SketchButton size="sm">Review</SketchButton>}
          className="w-72"
        />
        <KnowledgeNode
          title="Without Actions"
          summary="This node has no action buttons."
          mastery="learning"
          stats={[{ label: 'Sources', value: '8' }]}
          className="w-72"
        />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">KnowledgeNode — composed with badges + actions</h2>
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
