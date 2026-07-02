import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PriorityBadge } from '@paper-ui/components/badges'

const meta: Meta<typeof PriorityBadge> = {
  title: 'Components/Badges/PriorityBadge',
  component: PriorityBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PriorityBadge>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PriorityBadge</h2>
      <div className="flex gap-4 flex-wrap">
        <PriorityBadge priority="low" />
        <PriorityBadge priority="medium" />
        <PriorityBadge priority="high" />
        <PriorityBadge priority="critical" />
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <PriorityBadge priority="low" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PriorityBadge</h2>
      <div className="flex gap-4 flex-wrap">
        <PriorityBadge priority="low" />
        <PriorityBadge priority="medium" />
        <PriorityBadge priority="high" />
        <PriorityBadge priority="critical" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PriorityBadge — urgency</h2>
      <div className="flex gap-4 flex-wrap">
        <PriorityBadge priority="low" />
        <PriorityBadge priority="medium" />
        <PriorityBadge priority="high" />
        <PriorityBadge priority="critical" />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PriorityBadge — task list</h2>
      <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-sm">Review lecture notes</span>
          <PriorityBadge priority="low" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Complete assignment</span>
          <PriorityBadge priority="high" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Exam prep</span>
          <PriorityBadge priority="critical" />
        </div>
      </div>
    </div>
  ),
}
