import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotebookSpiral } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof NotebookSpiral> = {
  title: 'Components/Decorations/NotebookSpiral',
  component: NotebookSpiral,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof NotebookSpiral>

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-72 h-80 pt-6">
        <NotebookSpiral count={12} />
        <div className="px-8 mt-4 space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#2c2c2c]">Spiral Pad</h3>
          <div className="border-b border-black/10 pb-1 font-mono text-sm">To-do list</div>
          <div className="border-b border-black/10 pb-1 font-mono text-sm">Groceries</div>
        </div>
      </Paper>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-64 h-48 pt-6">
        <NotebookSpiral count={12} />
        <p className="font-mono text-sm text-center px-6 mt-4">Default spiral, 12 rings.</p>
      </Paper>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] flex gap-8 justify-center flex-wrap">
      <Paper className="w-48 h-40 pt-6">
        <NotebookSpiral count={6} />
        <p className="font-mono text-xs text-center mt-3 px-4">6 rings</p>
      </Paper>
      <Paper className="w-64 h-48 pt-6">
        <NotebookSpiral count={12} />
        <p className="font-mono text-xs text-center mt-3 px-4">12 rings</p>
      </Paper>
      <Paper className="w-80 h-56 pt-6">
        <NotebookSpiral count={18} />
        <p className="font-mono text-xs text-center mt-3 px-4">18 rings</p>
      </Paper>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-80 min-h-64 pt-6">
        <NotebookSpiral count={14} />
        <div className="px-8 mt-4 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#2c2c2c]">Lecture Notes</h2>
          <div className="border-b border-black/10 pb-1 font-mono text-sm">Chapter 5: Thermodynamics</div>
          <div className="border-b border-black/10 pb-1 font-mono text-sm">First law of thermodynamics</div>
          <div className="border-b border-black/10 pb-1 font-mono text-sm">Enthalpy and heat capacity</div>
          <div className="font-mono text-sm text-gray-400">...</div>
        </div>
      </Paper>
    </div>
  ),
}
