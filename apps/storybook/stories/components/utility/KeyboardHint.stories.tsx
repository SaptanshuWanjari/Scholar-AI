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
    <div className="p-10 bg-[#f4f1ea] max-w-2xl">
      <KeyboardHint keys={['⌘', 'K']} label="to search" />
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-2xl">
      <KeyboardHint keys={['⌘', 'K']} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] space-y-4 max-w-2xl">
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-1">⌘K with label</p>
        <KeyboardHint keys={['⌘', 'K']} label="to search" />
      </section>
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-1">Ctrl+Shift+P with label</p>
        <KeyboardHint keys={['Ctrl', 'Shift', 'P']} label="to open command palette" />
      </section>
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-1">Esc with label</p>
        <KeyboardHint keys={['Esc']} label="to dismiss" />
      </section>
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-1">⌘Z with label</p>
        <KeyboardHint keys={['⌘', 'Z']} label="to undo" />
      </section>
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-1">⌘+Shift+Z with label</p>
        <KeyboardHint keys={['⌘', 'Shift', 'Z']} label="to redo" />
      </section>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-2xl">
      <p className="font-architect text-sm text-ink-muted leading-relaxed">
        Press <KeyboardHint keys={['⌘', 'K']} label="to open search" /> from anywhere in the
        application. Use <KeyboardHint keys={['⌘', 'Z']} label="to undo" /> or{' '}
        <KeyboardHint keys={['⌘', 'Shift', 'Z']} label="to redo" /> for editing. Dismiss any
        dialog with <KeyboardHint keys={['Esc']} />.
      </p>
    </div>
  ),
}
