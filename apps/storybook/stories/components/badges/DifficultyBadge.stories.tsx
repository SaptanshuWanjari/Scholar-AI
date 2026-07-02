import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DifficultyBadge } from '@paper-ui/components/badges'

const meta: Meta<typeof DifficultyBadge> = {
  title: 'Components/Badges/DifficultyBadge',
  component: DifficultyBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof DifficultyBadge>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">DifficultyBadge</h2>
      <div className="flex gap-4 flex-wrap">
        <DifficultyBadge difficulty="Easy" />
        <DifficultyBadge difficulty="Medium" />
        <DifficultyBadge difficulty="Hard" />
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <DifficultyBadge difficulty="Easy" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">DifficultyBadge</h2>
      <div className="flex gap-4 flex-wrap">
        <DifficultyBadge difficulty="Easy" />
        <DifficultyBadge difficulty="Medium" />
        <DifficultyBadge difficulty="Hard" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">DifficultyBadge — with dot indicator</h2>
      <div className="flex gap-4 flex-wrap">
        <DifficultyBadge difficulty="Easy" showIcon />
        <DifficultyBadge difficulty="Medium" showIcon />
        <DifficultyBadge difficulty="Hard" showIcon />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">DifficultyBadge — in card</h2>
      <div className="flex gap-4 flex-wrap p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Difficulty:</span>
          <DifficultyBadge difficulty="Hard" showIcon />
        </div>
      </div>
    </div>
  ),
}
