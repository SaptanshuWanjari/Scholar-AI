import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { KeyboardHint } from '@paper-ui/components/utility'

const meta: Meta<typeof KeyboardHint> = {
  title: 'Components/Utility/KeyboardHint',
  component: KeyboardHint,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof KeyboardHint>

export const Playground: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <KeyboardHint keys={['⌘', 'K']} label="to search" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <div>
        <KeyboardHint keys={['⌘', 'K']} label="to search" />
      </div>
      <div>
        <KeyboardHint keys={['Ctrl', 'Shift', 'P']} label="command palette" />
      </div>
      <div>
        <KeyboardHint keys={['⌘', 'Z']} label="to undo" />
      </div>
      <div>
        <KeyboardHint keys={['Esc']} label="to dismiss" />
      </div>
    </div>
  ),
}

export const WithoutLabel: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <KeyboardHint keys={['⌘', 'K']} />
      <KeyboardHint keys={['Ctrl', 'C']} />
      <KeyboardHint keys={['Esc']} />
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4 text-sm leading-relaxed max-w-md">
      <p>
        Press <KeyboardHint keys={['⌘', 'K']} /> to search.
      </p>
      <p>
        Use <KeyboardHint keys={['⌘', 'Z']} /> or <KeyboardHint keys={['⌘', 'Shift', 'Z']} /> for undo/redo.
      </p>
    </div>
  ),
}
