import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperButton } from '@paper-ui/components/buttons'
import { Plus, Download, Pencil } from 'lucide-react'

const meta: Meta<typeof PaperButton> = {
  title: 'Components/Buttons/PaperButton',
  component: PaperButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperButton>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <PaperButton tone="paper">Paper</PaperButton>
      <PaperButton tone="dark">Dark</PaperButton>
      <PaperButton tone="green">Green</PaperButton>
      <PaperButton tone="red">Red</PaperButton>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <PaperButton tone="dark">PaperButton</PaperButton>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold mb-4">PaperButton — tones</h2>
      <div className="flex flex-wrap gap-4 items-center">
        <PaperButton tone="paper">Paper</PaperButton>
        <PaperButton tone="dark">Dark</PaperButton>
        <PaperButton tone="green">Green</PaperButton>
        <PaperButton tone="red">Red</PaperButton>
      </div>

      <h2 className="font-serif text-xl font-bold">PaperButton — sizes</h2>
      <div className="flex flex-wrap gap-4 items-end">
        <PaperButton size="sm">Small</PaperButton>
        <PaperButton size="md">Medium</PaperButton>
        <PaperButton size="lg">Large</PaperButton>
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperButton — states</h2>
      <div className="flex flex-wrap gap-4 items-center">
        <PaperButton tone="dark" disabled>Disabled</PaperButton>
        <PaperButton tone="paper" disabled>Disabled Paper</PaperButton>
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperButton — with icons</h2>
      <div className="flex flex-wrap gap-4 items-center">
        <PaperButton tone="dark"><Plus size={16} /> New Document</PaperButton>
        <PaperButton tone="green"><Download size={16} /> Export</PaperButton>
        <PaperButton tone="paper"><Pencil size={16} /> Edit</PaperButton>
      </div>
    </div>
  ),
}
