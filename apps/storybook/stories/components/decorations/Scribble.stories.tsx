import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Scribble } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof Scribble> = {
  title: 'Components/Decorations/Scribble',
  component: Scribble,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Scribble>

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-72 p-6">
        <p className="font-mono text-sm text-gray-700 mb-3">
          Scribble marks can convey rough-draft energy or hand-drawn annotations.
        </p>
        <Scribble className="h-4 w-32 mt-4" color="#3b82f6" />
      </Paper>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-48 p-4">
        <p className="font-mono text-xs mb-2">A simple scribble underline:</p>
        <Scribble className="h-4 w-24" />
      </Paper>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-80 p-6 space-y-6">
        <div>
          <p className="font-mono text-xs mb-1">Blue, default stroke</p>
          <Scribble className="h-4 w-40" color="#3b82f6" />
        </div>
        <div>
          <p className="font-mono text-xs mb-1">Red, thick stroke</p>
          <Scribble className="h-4 w-48" color="#ef4444" strokeWidth={3} />
        </div>
        <div>
          <p className="font-mono text-xs mb-1">Green, thin stroke</p>
          <Scribble className="h-4 w-56" color="#22c55e" strokeWidth={1} />
        </div>
        <div>
          <p className="font-mono text-xs mb-1">Gray, faded</p>
          <Scribble className="h-4 w-36 opacity-50" color="#6b7280" />
        </div>
      </Paper>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-80 p-6">
        <h3 className="font-serif text-xl font-bold mb-3">Rough Draft</h3>
        <p className="font-mono text-sm text-gray-700 mb-2">
          This section still needs work. The scribbles show where edits are needed.
        </p>
        <Scribble className="h-4 w-48 mt-2" color="#f59e0b" />
        <p className="font-mono text-sm text-gray-700 line-through mt-3">
          Old version of this paragraph
        </p>
        <Scribble className="h-4 w-64 mt-1" color="#ef4444" strokeWidth={3} />
        <p className="font-mono text-sm text-gray-700 mt-3">
          Revised version with updated conclusions.
        </p>
        <Scribble className="h-4 w-40 mt-2" color="#22c55e" />
      </Paper>
    </div>
  ),
}
