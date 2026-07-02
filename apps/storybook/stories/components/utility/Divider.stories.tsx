import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from '@paper-ui/components/utility'

const meta: Meta<typeof Divider> = {
  title: 'Components/Utility/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Divider>

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] space-y-12 max-w-2xl">
      <Divider variant="wavy" />
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-2xl">
      <Divider variant="wavy" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] space-y-12 max-w-2xl">
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">wavy</p>
        <Divider variant="wavy" />
      </section>
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">straight</p>
        <Divider variant="straight" />
      </section>
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">dashed</p>
        <Divider variant="dashed" />
      </section>
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">line</p>
        <Divider variant="line" />
      </section>
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">wavy with label</p>
        <Divider variant="wavy" label="Section" />
      </section>
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">dashed with label</p>
        <Divider variant="dashed" label="Continue" />
      </section>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-2xl">
      <p className="font-architect text-xs text-ink-muted/60 mb-4">vertical dividers between text labels</p>
      <div className="flex items-center gap-2 h-6">
        <span className="font-architect text-sm text-ink-muted">Files</span>
        <Divider orientation="vertical" />
        <span className="font-architect text-sm text-ink-muted">Edits</span>
        <Divider orientation="vertical" />
        <span className="font-architect text-sm text-ink-muted">Commits</span>
      </div>
    </div>
  ),
}
