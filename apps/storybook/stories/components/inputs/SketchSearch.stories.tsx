import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SketchSearch, ShortcutKey } from '@paper-ui/components/inputs'

const meta: Meta<typeof SketchSearch> = {
  title: 'Components/Inputs/SketchSearch',
  component: SketchSearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof SketchSearch>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <SketchSearch placeholder="Search documents, concepts, sessions…" width={400} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-4 bg-[#f4f1ea]">
      <SketchSearch placeholder="Wide search" width={400} />
      <SketchSearch placeholder="Narrow search" width={280} />
      <SketchSearch placeholder="No shortcut" shortcut={null} width={320} />
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-4 bg-[#f4f1ea]">
      <SketchSearch placeholder="Search with shortcut" width={400} />
      <div className="flex items-center gap-2 mt-4">
        <span className="font-architect text-sm text-ink-muted">Shortcuts:</span>
        <ShortcutKey>⌘</ShortcutKey>
        <ShortcutKey>K</ShortcutKey>
        <ShortcutKey>Ctrl</ShortcutKey>
        <ShortcutKey>Shift</ShortcutKey>
        <ShortcutKey>P</ShortcutKey>
      </div>
    </div>
  ),
}
