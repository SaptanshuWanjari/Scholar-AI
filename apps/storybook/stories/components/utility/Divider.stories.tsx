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
    <div className="p-8 bg-[#f4f1ea] max-w-2xl">
      <Divider variant="wavy" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-2xl space-y-8">
      <div className="space-y-2">
        <p className="font-architect text-xs text-ink-muted/60">wavy</p>
        <Divider variant="wavy" />
      </div>
      <div className="space-y-2">
        <p className="font-architect text-xs text-ink-muted/60">straight</p>
        <Divider variant="straight" />
      </div>
      <div className="space-y-2">
        <p className="font-architect text-xs text-ink-muted/60">dashed</p>
        <Divider variant="dashed" />
      </div>
      <div className="space-y-2">
        <p className="font-architect text-xs text-ink-muted/60">line</p>
        <Divider variant="line" />
      </div>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-2xl space-y-6">
      <Divider variant="wavy" label="Section Break" />
      <Divider variant="dashed" label="Continue" />
      <Divider variant="straight" label="Part 2" />
    </div>
  ),
}

export const Orientations: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex items-center gap-2 h-6">
        <span className="font-architect text-sm">Files</span>
        <Divider orientation="vertical" />
        <span className="font-architect text-sm">Edits</span>
        <Divider orientation="vertical" />
        <span className="font-architect text-sm">Commits</span>
      </div>
    </div>
  ),
}
