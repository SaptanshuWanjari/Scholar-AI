import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperLabel } from '@paper-ui/components/inputs'
import { PaperInput } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperLabel> = {
  title: 'Components/Inputs/PaperLabel',
  component: PaperLabel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperLabel>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <PaperLabel>Single label</PaperLabel>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-sm space-y-4">
      <div>
        <PaperLabel className="mb-2 block">With Input</PaperLabel>
        <PaperInput placeholder="Input with label" />
      </div>
      <div>
        <PaperLabel className="mb-2 block">Another Label</PaperLabel>
        <PaperInput placeholder="Another labeled input" />
      </div>
    </div>
  ),
}
