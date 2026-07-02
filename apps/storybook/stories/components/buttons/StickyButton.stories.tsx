import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StickyButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof StickyButton> = {
  title: 'Components/Buttons/StickyButton',
  component: StickyButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof StickyButton>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">StickyButton</h2>
      <p className="font-mono text-sm text-gray-600">Taped-down button — ideal for "Ask AI" / "Teach Me" CTAs.</p>
      <div className="flex flex-wrap gap-8 items-end pt-4">
        <StickyButton>Ask AI</StickyButton>
        <StickyButton tone="dark">Teach Me</StickyButton>
        <StickyButton tone="green" taped={false}>No Tape</StickyButton>
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <StickyButton>Ask AI</StickyButton>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">StickyButton — tones</h2>
      <div className="flex flex-wrap gap-8 items-end pt-4">
        <StickyButton>Ask AI</StickyButton>
        <StickyButton tone="dark">Teach Me</StickyButton>
        <StickyButton tone="green">Download</StickyButton>
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">StickyButton — taped state</h2>
      <div className="flex flex-wrap gap-8 items-end pt-4">
        <StickyButton taped={false}>No Tape</StickyButton>
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">StickyButton — all variants</h2>
      <div className="flex flex-wrap gap-8 items-end pt-4">
        <StickyButton>Ask AI</StickyButton>
        <StickyButton tone="dark">Teach Me</StickyButton>
        <StickyButton tone="green" taped={false}>No Tape</StickyButton>
      </div>
    </div>
  ),
}
