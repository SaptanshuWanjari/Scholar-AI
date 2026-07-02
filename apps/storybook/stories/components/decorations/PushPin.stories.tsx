import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PushPin } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof PushPin> = {
  title: 'Components/Decorations/PushPin',
  component: PushPin,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PushPin>

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper shadowVariant="hard" className="w-64 p-6 pt-10 rotate-1">
        <PushPin color="#c95f5f" position="top-center" size={26} />
        <h3 className="font-serif text-xl font-bold mb-2">Pinned Notice</h3>
        <p className="font-mono text-sm text-gray-700">
          A classic push pin keeps this important notice on the board.
        </p>
      </Paper>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-48 p-4 pt-8">
        <PushPin />
        <p className="font-mono text-xs text-center">Default push pin, top-center.</p>
      </Paper>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] flex gap-8 justify-center flex-wrap">
      <Paper className="w-48 p-4 pt-8">
        <PushPin color="#c95f5f" position="top-center" />
        <p className="font-mono text-xs text-center mt-1">red, top-center</p>
      </Paper>
      <Paper className="w-48 p-4 pt-8">
        <PushPin color="#4a6f91" position="top-left" />
        <p className="font-mono text-xs text-center mt-1">blue, top-left</p>
      </Paper>
      <Paper className="w-48 p-4 pt-8">
        <PushPin color="#3f7a4e" position="top-right" />
        <p className="font-mono text-xs text-center mt-1">green, top-right</p>
      </Paper>
      <Paper className="w-48 p-4 pt-8">
        <PushPin color="#6f63a3" size={18} />
        <p className="font-mono text-xs text-center mt-1">purple, small</p>
      </Paper>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper shadowVariant="hard" className="w-80 p-6 pt-10 rotate-[-1deg]">
        <PushPin color="#c95f5f" position="top-center" />
        <h2 className="font-serif text-2xl font-bold mb-4">Meeting Notes</h2>
        <ul className="font-mono text-sm text-gray-700 space-y-2 ml-4 list-disc">
          <li>Review Q3 roadmap</li>
          <li>Assign sprint tasks</li>
          <li>Schedule design review</li>
        </ul>
      </Paper>
    </div>
  ),
}
