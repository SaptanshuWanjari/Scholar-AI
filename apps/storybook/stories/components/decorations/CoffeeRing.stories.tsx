import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CoffeeRing } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof CoffeeRing> = {
  title: 'Components/Decorations/CoffeeRing',
  component: CoffeeRing,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof CoffeeRing>

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-72 p-8 pt-10">
        <CoffeeRing size={120} position="bottom-right" rotate={12} opacity={0.4} />
        <h3 className="font-serif text-xl font-bold mb-4">Well-Loved</h3>
        <p className="font-mono text-sm text-gray-700">
          Folded corners and coffee rings give your UI a lived-in, physical presence.
        </p>
      </Paper>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-48 p-4">
        <CoffeeRing size={64} position="bottom-right" opacity={0.18} />
        <p className="font-mono text-xs relative z-10">Default coffee ring.</p>
      </Paper>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] flex gap-8 justify-center flex-wrap">
      <Paper className="w-48 p-4">
        <CoffeeRing size={80} position="bottom-right" opacity={0.3} rotate={5} />
        <p className="font-mono text-xs relative z-10">large, bottom-right</p>
      </Paper>
      <Paper className="w-48 p-4">
        <CoffeeRing size={50} position="top-left" opacity={0.15} rotate={-8} />
        <p className="font-mono text-xs relative z-10">small, top-left</p>
      </Paper>
      <Paper className="w-48 p-4">
        <CoffeeRing size={64} position="center" opacity={0.12} />
        <p className="font-mono text-xs relative z-10">center, faint</p>
      </Paper>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-80 p-8 pt-10 rotate-[-1deg]">
        <CoffeeRing size={100} position="bottom-right" rotate={15} opacity={0.35} />
        <CoffeeRing size={60} position="top-left" rotate={-10} opacity={0.25} />
        <h2 className="font-serif text-2xl font-bold mb-4">Late Night Draft</h2>
        <p className="font-mono text-sm text-gray-700 relative z-10">
          Multiple coffee rings tell the story of a long editing session.
          The lived-in look makes the UI feel warm and approachable.
        </p>
        <div className="mt-4 font-mono text-xs text-gray-400">
          — drafted 2:47 AM
        </div>
      </Paper>
    </div>
  ),
}
