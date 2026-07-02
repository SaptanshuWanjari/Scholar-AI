import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperBadge } from '@paper-ui/components/badges'

const meta: Meta<typeof PaperBadge> = {
  title: 'Components/Badges/PaperBadge',
  component: PaperBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperBadge>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperBadge — all tones</h2>
      <div className="flex flex-wrap gap-3">
        <PaperBadge tone="ink">Ink</PaperBadge>
        <PaperBadge tone="sage">Sage</PaperBadge>
        <PaperBadge tone="ochre">Ochre</PaperBadge>
        <PaperBadge tone="sky">Sky</PaperBadge>
        <PaperBadge tone="lavender">Lavender</PaperBadge>
        <PaperBadge tone="brick">Brick</PaperBadge>
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <PaperBadge tone="ink">Badge</PaperBadge>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperBadge — all tones</h2>
      <div className="flex flex-wrap gap-3">
        <PaperBadge tone="ink">Ink</PaperBadge>
        <PaperBadge tone="sage">Sage</PaperBadge>
        <PaperBadge tone="ochre">Ochre</PaperBadge>
        <PaperBadge tone="sky">Sky</PaperBadge>
        <PaperBadge tone="lavender">Lavender</PaperBadge>
        <PaperBadge tone="brick">Brick</PaperBadge>
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperBadge — empty</h2>
      <div className="flex flex-wrap gap-3">
        <PaperBadge tone="ink" />
        <PaperBadge tone="sage" />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperBadge — grouped</h2>
      <div className="flex flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-lg">
        <PaperBadge tone="sage">Active</PaperBadge>
        <PaperBadge tone="ochre">Pending</PaperBadge>
        <PaperBadge tone="brick">Archived</PaperBadge>
      </div>
    </div>
  ),
}
