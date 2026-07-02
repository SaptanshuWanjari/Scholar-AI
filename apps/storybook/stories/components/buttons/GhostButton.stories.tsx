import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { GhostButton } from '@paper-ui/components/buttons'
import { Trash2 } from 'lucide-react'

const meta: Meta<typeof GhostButton> = {
  title: 'Components/Buttons/GhostButton',
  component: GhostButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof GhostButton>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">GhostButton</h2>
      <p className="font-mono text-sm text-gray-600">Transparent border, muted text — secondary actions.</p>
      <div className="flex flex-wrap gap-4">
        <GhostButton>Cancel</GhostButton>
        <GhostButton size="sm"><Trash2 size={14} /> Delete</GhostButton>
        <GhostButton size="lg">View All →</GhostButton>
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <GhostButton>Cancel</GhostButton>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">GhostButton — sizes</h2>
      <div className="flex flex-wrap gap-4 items-end">
        <GhostButton size="sm">Small</GhostButton>
        <GhostButton size="md">Medium</GhostButton>
        <GhostButton size="lg">Large</GhostButton>
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">GhostButton — disabled</h2>
      <div className="flex flex-wrap gap-4">
        <GhostButton disabled>Disabled</GhostButton>
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">GhostButton — with icons</h2>
      <div className="flex flex-wrap gap-4">
        <GhostButton size="sm"><Trash2 size={14} /> Delete</GhostButton>
        <GhostButton size="lg">View All →</GhostButton>
      </div>
    </div>
  ),
}
