import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tape } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof Tape> = {
  title: 'Components/Decorations/Tape',
  component: Tape,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Tape>

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper shadowVariant="sketch" className="w-80 p-6 mx-auto mt-6 rotate-2">
        <Tape corner="top-center" rotate={-3} color="#e0cfa4" width={58} />
        <h3 className="font-serif text-xl font-bold mb-2">Taped Note</h3>
        <p className="font-mono text-sm text-gray-700">
          This paper is held up by some translucent tape. Notice how it overlays the border.
        </p>
      </Paper>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-64 p-4">
        <Tape corner="top-left" color="var(--color-tape)" />
        <p className="font-mono text-sm">Default tape, top-left corner.</p>
      </Paper>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] flex gap-8 justify-center flex-wrap">
      <Paper className="w-48 p-4 rotate-[-2deg]">
        <Tape corner="top-center" color="#e0cfa4" />
        <p className="font-mono text-xs text-center mt-2">top-center</p>
      </Paper>
      <Paper className="w-48 p-4">
        <Tape corner="top-left" rotate={-45} color="#f0d3a8" />
        <Tape corner="bottom-right" rotate={-45} color="#f0d3a8" />
        <p className="font-mono text-xs text-center mt-2">top-left + bottom-right, -45°</p>
      </Paper>
      <Paper className="w-48 p-4 rotate-[3deg] bg-[#e8f5e9]">
        <Tape corner="top-right" rotate={15} color="#c8e6c9" width={80} />
        <p className="font-mono text-xs text-center mt-2">top-right, green, wide</p>
      </Paper>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper shadowVariant="sketch" className="w-96 p-6 mx-auto rotate-1">
        <Tape corner="top-center" rotate={-3} color="#e0cfa4" />
        <h2 className="font-serif text-2xl font-bold mb-4">Sketch Journal</h2>
        <p className="font-mono text-sm text-gray-700 mb-3">
          Ideas loosely taped to the wall. The tape adds a casual, work-in-progress feel.
        </p>
        <div className="w-full h-32 border border-dashed border-gray-300 rounded flex items-center justify-center">
          <span className="font-mono text-xs text-gray-400">[ sketch area ]</span>
        </div>
      </Paper>
    </div>
  ),
}
