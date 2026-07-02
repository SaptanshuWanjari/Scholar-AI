import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ShortcutKey } from '@paper-ui/components/utility'

const meta: Meta<typeof ShortcutKey> = {
  title: 'Components/Utility/ShortcutKey',
  component: ShortcutKey,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ShortcutKey>

export const Playground: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <ShortcutKey keys={['⌘', 'K']} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3 flex flex-col w-fit">
      <ShortcutKey keys={['⌘', 'K']} />
      <ShortcutKey keys={['Ctrl', 'Shift', 'P']} />
      <ShortcutKey keys={['Esc']} />
      <ShortcutKey keys={['⌘', 'Z']} />
    </div>
  ),
}

export const Inline: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-2 max-w-md text-sm leading-relaxed">
      <p className="font-architect">
        Press <ShortcutKey keys={['⌘', 'K']} /> to open command bar
      </p>
      <p className="font-architect">
        Use <ShortcutKey keys={['Ctrl', 'C']} /> to copy
      </p>
      <p className="font-architect">
        Dismiss with <ShortcutKey keys={['Esc']} />
      </p>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <ShortcutKey>
        <ShortcutKey.Key>⌘</ShortcutKey.Key>
        <ShortcutKey.Plus />
        <ShortcutKey.Key>K</ShortcutKey.Key>
      </ShortcutKey>
      <ShortcutKey>
        <ShortcutKey.Key>Ctrl</ShortcutKey.Key>
        <ShortcutKey.Plus />
        <ShortcutKey.Key>Shift</ShortcutKey.Key>
        <ShortcutKey.Plus />
        <ShortcutKey.Key>P</ShortcutKey.Key>
      </ShortcutKey>
    </div>
  ),
}
