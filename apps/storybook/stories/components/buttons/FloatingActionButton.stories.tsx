import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FloatingActionButton } from '@paper-ui/components/buttons'
import { Plus, Pencil } from 'lucide-react'

const meta: Meta<typeof FloatingActionButton> = {
  title: 'Components/Buttons/FloatingActionButton',
  component: FloatingActionButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof FloatingActionButton>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">FloatingActionButton — tones & sizes</h2>
      <div className="flex flex-wrap gap-6 items-end">
        <div className="flex flex-col items-center gap-2">
          <FloatingActionButton label="Add small" size="sm" tone="dark"><Plus size={16} /></FloatingActionButton>
          <span className="font-mono text-xs text-gray-500">sm / dark</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FloatingActionButton label="Add medium" size="md" tone="paper"><Plus size={20} /></FloatingActionButton>
          <span className="font-mono text-xs text-gray-500">md / paper</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FloatingActionButton label="Add large" size="lg" tone="green"><Plus size={24} /></FloatingActionButton>
          <span className="font-mono text-xs text-gray-500">lg / green</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FloatingActionButton label="Edit" size="md" tone="red"><Pencil size={20} /></FloatingActionButton>
          <span className="font-mono text-xs text-gray-500">md / red</span>
        </div>
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <FloatingActionButton label="Add" size="md" tone="dark"><Plus size={20} /></FloatingActionButton>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">FloatingActionButton — tones & sizes</h2>
      <div className="flex flex-wrap gap-6 items-end">
        <div className="flex flex-col items-center gap-2">
          <FloatingActionButton label="Add small" size="sm" tone="dark"><Plus size={16} /></FloatingActionButton>
          <span className="font-mono text-xs text-gray-500">sm / dark</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FloatingActionButton label="Add medium" size="md" tone="paper"><Plus size={20} /></FloatingActionButton>
          <span className="font-mono text-xs text-gray-500">md / paper</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FloatingActionButton label="Add large" size="lg" tone="green"><Plus size={24} /></FloatingActionButton>
          <span className="font-mono text-xs text-gray-500">lg / green</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FloatingActionButton label="Edit" size="md" tone="red"><Pencil size={20} /></FloatingActionButton>
          <span className="font-mono text-xs text-gray-500">md / red</span>
        </div>
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">FloatingActionButton — disabled</h2>
      <div className="flex flex-wrap gap-6 items-end">
        <FloatingActionButton label="Add" size="md" tone="dark" disabled><Plus size={20} /></FloatingActionButton>
        <FloatingActionButton label="Edit" size="md" tone="red" disabled><Pencil size={20} /></FloatingActionButton>
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">FloatingActionButton — corner placement</h2>
      <div className="relative h-64 bg-white border border-gray-200 rounded-lg">
        <div className="absolute bottom-4 right-4 flex flex-col gap-3">
          <FloatingActionButton label="Add" size="md" tone="dark"><Plus size={20} /></FloatingActionButton>
          <FloatingActionButton label="Edit" size="md" tone="paper"><Pencil size={20} /></FloatingActionButton>
        </div>
      </div>
    </div>
  ),
}
