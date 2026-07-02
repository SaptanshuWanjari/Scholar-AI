import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperClip } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof PaperClip> = {
  title: 'Components/Decorations/PaperClip',
  component: PaperClip,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PaperClip>

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-64 p-6 pt-8 rotate-[-2deg]">
        <PaperClip color="#7a7a7a" position="top-left" size={28} />
        <h3 className="font-serif text-xl font-bold mb-2">Clipped Document</h3>
        <p className="font-mono text-sm text-gray-700">
          Attached with a metallic paper clip for a professional yet crafted look.
        </p>
      </Paper>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-48 p-4 pt-8">
        <PaperClip />
        <p className="font-mono text-xs text-center">Default paper clip, top-left.</p>
      </Paper>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] flex gap-8 justify-center flex-wrap">
      <Paper className="w-48 p-4 pt-8">
        <PaperClip color="#8a8a8a" position="top-left" />
        <p className="font-mono text-xs text-center">gray, top-left</p>
      </Paper>
      <Paper className="w-48 p-4 pt-8">
        <PaperClip color="#c95f5f" position="top-center" />
        <p className="font-mono text-xs text-center">red, top-center</p>
      </Paper>
      <Paper className="w-48 p-4 pt-8">
        <PaperClip color="#4a6f91" position="top-right" />
        <p className="font-mono text-xs text-center">blue, top-right</p>
      </Paper>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-80 p-6 pt-8 rotate-1">
        <PaperClip color="#7a7a7a" position="top-left" />
        <h2 className="font-serif text-2xl font-bold mb-4">Invoice #1042</h2>
        <table className="w-full font-mono text-sm text-gray-700 border-collapse">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2">Design work</td>
              <td className="py-2 text-right">$2,400</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2">Consulting</td>
              <td className="py-2 text-right">$800</td>
            </tr>
            <tr>
              <td className="py-2 font-bold">Total</td>
              <td className="py-2 text-right font-bold">$3,200</td>
            </tr>
          </tbody>
        </table>
      </Paper>
    </div>
  ),
}
