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

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <KnowledgeGraphNode
        title="Backpropagation"
        mastery="learning"
        sourceCount={8}
        timeEstimate="20 min"
      />
    </div>
  ),
}

export const MasteryLevels: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex flex-wrap gap-4">
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
  ),
}

export const SelectedAndDimmed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex flex-wrap gap-4">
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
  ),
}

export const GraphCluster: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex flex-wrap gap-4">
      <KnowledgeGraphNode title="Backpropagation" mastery="learning" sourceCount={8} selected timeEstimate="35 min" onClick={() => {}} />
      <KnowledgeGraphNode title="Neural Networks" mastery="mastered" sourceCount={12} timeEstimate="20 min" onClick={() => {}} />
      <KnowledgeGraphNode title="Optimization" mastery="weak" dimmed sourceCount={5} onClick={() => {}} />
      <KnowledgeGraphNode title="Calculus" mastery="mastered" sourceCount={3} timeEstimate="10 min" onClick={() => {}} />
    </div>
  ),
}
