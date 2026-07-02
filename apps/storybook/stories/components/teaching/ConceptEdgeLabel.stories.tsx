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

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">ConceptEdgeLabel — relation types</h2>
      <div className="flex flex-wrap gap-3">
        {(['covers', 'requires', 'uses', 'related', 'introduces', 'prerequisite'] as const).map(rel => (
          <ConceptEdgeLabel key={rel} label={rel} relation={rel} />
        ))}
        <ConceptEdgeLabel label="Custom label" />
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <ConceptEdgeLabel label="requires" relation="requires" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">ConceptEdgeLabel — all relations</h2>
      <div className="flex flex-wrap gap-3">
        <ConceptEdgeLabel label="covers" relation="covers" />
        <ConceptEdgeLabel label="requires" relation="requires" />
        <ConceptEdgeLabel label="uses" relation="uses" />
        <ConceptEdgeLabel label="related" relation="related" />
        <ConceptEdgeLabel label="introduces" relation="introduces" />
        <ConceptEdgeLabel label="prerequisite" relation="prerequisite" />
      </div>

      <h2 className="font-serif text-xl font-bold mt-6">ConceptEdgeLabel — custom labels</h2>
      <div className="flex flex-wrap gap-3">
        <ConceptEdgeLabel label="Custom label" />
        <ConceptEdgeLabel label="extends" />
        <ConceptEdgeLabel label="depends on" relation="prerequisite" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">ConceptEdgeLabel — with/without relation type</h2>
      <div className="flex flex-wrap gap-3">
        <ConceptEdgeLabel label="requires" relation="requires" />
        <ConceptEdgeLabel label="covers" relation="covers" />
        <ConceptEdgeLabel label="Custom label" />
        <ConceptEdgeLabel label="Another custom" />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">ConceptEdgeLabel — in edge context</h2>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-kalam text-sm text-ink">Neural Networks</span>
        <span className="text-ink-muted">—</span>
        <ConceptEdgeLabel label="requires" relation="requires" />
        <span className="text-ink-muted">→</span>
        <span className="font-kalam text-sm text-ink">Calculus</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap mt-4">
        <span className="font-kalam text-sm text-ink">ML</span>
        <span className="text-ink-muted">—</span>
        <ConceptEdgeLabel label="covers" relation="covers" />
        <span className="text-ink-muted">→</span>
        <span className="font-kalam text-sm text-ink">Backpropagation</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap mt-4">
        <span className="font-kalam text-sm text-ink">Optimization</span>
        <span className="text-ink-muted">—</span>
        <ConceptEdgeLabel label="related" relation="related" />
        <span className="text-ink-muted">→</span>
        <span className="font-kalam text-sm text-ink">Gradient Descent</span>
      </div>
    </div>
  ),
}
