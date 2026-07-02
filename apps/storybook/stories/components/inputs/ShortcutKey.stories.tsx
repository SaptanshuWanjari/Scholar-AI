import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ShortcutKey } from '@paper-ui/components/inputs'

const meta: Meta<typeof ShortcutKey> = {
  title: 'Components/Inputs/ShortcutKey',
  component: ShortcutKey,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ShortcutKey>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <ShortcutKey>⌘</ShortcutKey>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex items-center gap-2">
        <ShortcutKey>⌘</ShortcutKey>
        <ShortcutKey>K</ShortcutKey>
        <ShortcutKey>Ctrl</ShortcutKey>
        <ShortcutKey>Shift</ShortcutKey>
        <ShortcutKey>P</ShortcutKey>
      </div>
    </div>
  ),
}
