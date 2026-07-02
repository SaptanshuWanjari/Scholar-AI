import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from '@paper-ui/components/utility'

const meta: Meta<typeof Separator> = {
  title: 'Components/Utility/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Separator>

export const Playground: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-2xl">
      <p className="font-architect text-sm text-ink-muted mb-2">Above</p>
      <Separator />
      <p className="font-architect text-sm text-ink-muted mt-2">Below</p>
    </div>
  ),
}

export const Orientations: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-6">
      <div className="space-y-2">
        <p className="font-architect text-xs text-ink-muted/60">horizontal</p>
        <p className="font-architect text-sm text-ink-muted">Section A</p>
        <Separator orientation="horizontal" />
        <p className="font-architect text-sm text-ink-muted">Section B</p>
      </div>
      <div className="space-y-2">
        <p className="font-architect text-xs text-ink-muted/60">vertical (in toolbar)</p>
        <div className="flex items-center h-6 gap-1">
          <span className="font-architect text-sm">Cut</span>
          <Separator orientation="vertical" />
          <span className="font-architect text-sm">Copy</span>
          <Separator orientation="vertical" />
          <span className="font-architect text-sm">Paste</span>
        </div>
      </div>
    </div>
  ),
}

export const Menu: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm">
      <div className="space-y-1">
        <p className="font-caveat text-lg font-semibold text-ink">Menu</p>
        <Separator />
        <p className="font-architect text-sm text-ink-muted py-1">Settings</p>
        <p className="font-architect text-sm text-ink-muted py-1">Profile</p>
        <Separator />
        <p className="font-architect text-sm text-ink-muted py-1">Log out</p>
      </div>
    </div>
  ),
}
