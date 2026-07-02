import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { KnowledgeGraphNode } from '@paper-ui/components/teaching'

const meta: Meta<typeof KnowledgeGraphNode> = {
  title: 'Components/Teaching/KnowledgeGraphNode',
  component: KnowledgeGraphNode,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof KnowledgeGraphNode>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">KnowledgeGraphNode — for graph layouts</h2>
      <div className="flex flex-wrap gap-4">
        {(['mastered', 'learning', 'weak', 'unknown'] as const).map(mastery => (
          <KnowledgeGraphNode
            key={mastery}
            title={`${mastery} node`}
            mastery={mastery}
            sourceCount={5}
            timeEstimate="20 min"
            onClick={() => {}}
          />
        ))}
        <KnowledgeGraphNode
          title="Selected node"
          mastery="learning"
          sourceCount={8}
          selected
          timeEstimate="35 min"
        />
        <KnowledgeGraphNode
          title="Dimmed node"
          mastery="mastered"
          dimmed
          sourceCount={3}
        />
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <KnowledgeGraphNode
        title="Backpropagation"
        mastery="learning"
        sourceCount={8}
        timeEstimate="20 min"
      />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">KnowledgeGraphNode — mastery levels</h2>
      <div className="flex flex-wrap gap-4">
        {(['mastered', 'learning', 'weak', 'unknown'] as const).map(mastery => (
          <KnowledgeGraphNode
            key={mastery}
            title={`${mastery} node`}
            mastery={mastery}
            sourceCount={5}
            timeEstimate="20 min"
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">KnowledgeGraphNode — selected & dimmed</h2>
      <div className="flex flex-wrap gap-4">
        <KnowledgeGraphNode
          title="Selected node"
          mastery="learning"
          sourceCount={8}
          selected
          timeEstimate="35 min"
        />
        <KnowledgeGraphNode
          title="Dimmed node"
          mastery="mastered"
          dimmed
          sourceCount={3}
        />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">KnowledgeGraphNode — graph cluster</h2>
      <div className="flex flex-wrap gap-4">
        <KnowledgeGraphNode
          title="Backpropagation"
          mastery="learning"
          sourceCount={8}
          selected
          timeEstimate="35 min"
          onClick={() => {}}
        />
        <KnowledgeGraphNode
          title="Neural Networks"
          mastery="mastered"
          sourceCount={12}
          timeEstimate="20 min"
          onClick={() => {}}
        />
        <KnowledgeGraphNode
          title="Optimization"
          mastery="weak"
          dimmed
          sourceCount={5}
          onClick={() => {}}
        />
        <KnowledgeGraphNode
          title="Calculus"
          mastery="mastered"
          sourceCount={3}
          timeEstimate="10 min"
          onClick={() => {}}
        />
      </div>
    </div>
  ),
}
