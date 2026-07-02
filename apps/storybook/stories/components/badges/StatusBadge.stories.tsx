import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusBadge } from '@paper-ui/components/badges'

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/Badges/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof StatusBadge>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">StatusBadge — document states</h2>
      <div className="flex gap-4 flex-wrap">
        <StatusBadge status="indexed" />
        <StatusBadge status="processing" />
        <StatusBadge status="failed" />
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <StatusBadge status="indexed" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">StatusBadge — document states</h2>
      <div className="flex gap-4 flex-wrap">
        <StatusBadge status="indexed" />
        <StatusBadge status="processing" />
        <StatusBadge status="failed" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">StatusBadge — all states</h2>
      <div className="flex gap-4 flex-wrap">
        <StatusBadge status="indexed" />
        <StatusBadge status="processing" />
        <StatusBadge status="failed" />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">StatusBadge — in document list</h2>
      <div className="flex gap-4 flex-wrap p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">notes.pdf</span>
          <StatusBadge status="indexed" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">thesis.docx</span>
          <StatusBadge status="processing" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">corrupted.pdf</span>
          <StatusBadge status="failed" />
        </div>
      </div>
    </div>
  ),
}
