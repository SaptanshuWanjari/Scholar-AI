import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotebookEdge } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof NotebookEdge> = {
  title: 'Components/Decorations/NotebookEdge',
  component: NotebookEdge,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof NotebookEdge>

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-72 h-80 pl-10 pt-6">
        <NotebookEdge position="left" holes={12} />
        <div className="px-6 space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#2c2c2c]">Torn Page</h3>
          <div className="border-b border-blue-200 pb-1 font-mono text-sm">Meeting notes</div>
        </div>
      </Paper>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-64 h-40 pl-10 pt-6">
        <NotebookEdge position="left" holes={12} />
        <p className="font-mono text-sm px-4">Default left edge, 12 holes.</p>
      </Paper>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] flex gap-8 justify-center flex-wrap">
      <Paper className="w-48 h-36 pl-10 pt-6">
        <NotebookEdge position="left" holes={6} />
        <p className="font-mono text-xs px-4">left, 6 holes</p>
      </Paper>
      <Paper className="w-48 h-36 pl-10 pt-6">
        <NotebookEdge position="left" holes={12} />
        <p className="font-mono text-xs px-4">left, 12 holes</p>
      </Paper>
      <Paper className="w-64 h-20 pt-10">
        <NotebookEdge position="top" holes={8} />
        <p className="font-mono text-xs text-center px-4">top, 8 holes</p>
      </Paper>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-80 h-96 pl-10 pt-6">
        <NotebookEdge position="left" holes={12} />
        <div className="px-6 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#2c2c2c]">Brainstorm</h2>
          <div className="border-b border-gray-200 pb-1 font-mono text-sm">Product ideas:</div>
          <div className="border-b border-gray-200 pb-1 font-mono text-sm pl-4">- Voice notes app</div>
          <div className="border-b border-gray-200 pb-1 font-mono text-sm pl-4">- Shared grocery list</div>
          <div className="border-b border-gray-200 pb-1 font-mono text-sm">Design concepts:</div>
          <div className="border-b border-gray-200 pb-1 font-mono text-sm pl-4">- Skeuomorphic calendar</div>
          <div className="border-b border-gray-200 pb-1 font-mono text-sm pl-4">- Paper-fold transitions</div>
        </div>
      </Paper>
    </div>
  ),
}
