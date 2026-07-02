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
    <div className="p-10 bg-[#f4f1ea] space-y-6 max-w-2xl">
      <Separator />
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] space-y-4 max-w-2xl">
      <p className="font-architect text-sm text-ink-muted">Item above</p>
      <Separator />
      <p className="font-architect text-sm text-ink-muted">Item below</p>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] space-y-8 max-w-2xl">
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">horizontal</p>
        <div className="space-y-2">
          <p className="font-architect text-sm text-ink-muted">Section A</p>
          <Separator orientation="horizontal" />
          <p className="font-architect text-sm text-ink-muted">Section B</p>
        </div>
      </section>
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">vertical</p>
        <div className="flex items-center gap-1">
          <span className="font-architect text-sm text-ink-muted">Cut</span>
          <Separator orientation="vertical" />
          <span className="font-architect text-sm text-ink-muted">Copy</span>
          <Separator orientation="vertical" />
          <span className="font-architect text-sm text-ink-muted">Paste</span>
        </div>
      </section>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-2xl">
      <div className="space-y-0.5">
        <p className="font-caveat text-xl font-semibold text-ink">Menu</p>
        <Separator />
        <p className="font-architect text-sm text-ink-muted">Settings</p>
        <p className="font-architect text-sm text-ink-muted">Profile</p>
        <Separator />
        <p className="font-architect text-sm text-ink-muted">Log out</p>
      </div>
    </div>
  ),
}
