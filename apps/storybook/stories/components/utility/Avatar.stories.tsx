import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '@paper-ui/components/utility'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Utility/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Avatar>

const TONES = ['sage', 'ochre', 'sky', 'lavender', 'brick', 'ink'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export const Playground: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Avatar name="Ada Lovelace" tone="sage" size="lg" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-end gap-4">
      {SIZES.map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <Avatar name="Ada" tone="sage" size={s} />
          <span className="font-architect text-[10px] text-ink-muted/50">{s}</span>
        </div>
      ))}
    </div>
  ),
}

export const Tones: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center gap-3">
      {TONES.map((t) => (
        <Avatar key={t} name="User" tone={t} size="md" />
      ))}
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-6">
      <div className="space-y-2">
        <p className="font-architect text-xs text-ink-muted/60">With image</p>
        <div className="flex gap-2">
          <Avatar name="Ada" tone="sage" size="md" src="https://picsum.photos/seed/ada/100/100" />
          <Avatar name="Alan" tone="ochre" size="md" src="https://picsum.photos/seed/alan/100/100" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="font-architect text-xs text-ink-muted/60">Initials (no src)</p>
        <div className="flex gap-2">
          <Avatar name="Grace Hopper" tone="sky" size="md" />
          <Avatar name="John von Neumann" tone="lavender" size="md" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="font-architect text-xs text-ink-muted/60">Anonymous (no name/src)</p>
        <div className="flex gap-2">
          <Avatar size="sm" tone="brick" />
          <Avatar size="md" tone="ink" />
          <Avatar size="lg" tone="sage" />
        </div>
      </div>
    </div>
  ),
}
