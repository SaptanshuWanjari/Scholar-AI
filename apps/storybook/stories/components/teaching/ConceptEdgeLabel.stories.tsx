import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConceptEdgeLabel } from '@paper-ui/components/teaching'

const meta: Meta<typeof ConceptEdgeLabel> = {
  title: 'Components/Teaching/ConceptEdgeLabel',
  component: ConceptEdgeLabel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ConceptEdgeLabel>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <ConceptEdgeLabel label="requires" relation="requires" />
    </div>
  ),
}

export const AllRelations: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex flex-wrap gap-3">
      {(['covers', 'requires', 'uses', 'related', 'introduces', 'prerequisite'] as const).map(rel => (
        <ConceptEdgeLabel key={rel} label={rel} relation={rel} />
      ))}
    </div>
  ),
}

export const InEdgeContext: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-kalam text-sm text-ink">Neural Networks</span>
        <span className="text-ink-muted">—</span>
        <ConceptEdgeLabel label="requires" relation="requires" />
        <span className="text-ink-muted">→</span>
        <span className="font-kalam text-sm text-ink">Calculus</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-kalam text-sm text-ink">ML</span>
        <span className="text-ink-muted">—</span>
        <ConceptEdgeLabel label="covers" relation="covers" />
        <span className="text-ink-muted">→</span>
        <span className="font-kalam text-sm text-ink">Backpropagation</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-kalam text-sm text-ink">Optimization</span>
        <span className="text-ink-muted">—</span>
        <ConceptEdgeLabel label="related" relation="related" />
        <span className="text-ink-muted">→</span>
        <span className="font-kalam text-sm text-ink">Gradient Descent</span>
      </div>
    </div>
  ),
}
