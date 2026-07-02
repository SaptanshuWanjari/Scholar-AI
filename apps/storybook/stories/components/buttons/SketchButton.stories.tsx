import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SketchButton } from '@paper-ui/components/buttons'
import { Search } from 'lucide-react'

const meta: Meta<typeof SketchButton> = {
  title: 'Components/Buttons/SketchButton',
  component: SketchButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof SketchButton>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">SketchButton</h2>
      <p className="font-mono text-sm text-gray-600">Alias for PaperButton with paper tone.</p>
      <div className="flex flex-wrap gap-4">
        <SketchButton>Default</SketchButton>
        <SketchButton size="sm">Small</SketchButton>
        <SketchButton size="lg"><Search size={16} /> Search</SketchButton>
        <SketchButton disabled>Disabled</SketchButton>
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <SketchButton>Default</SketchButton>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">SketchButton</h2>
      <p className="font-mono text-sm text-gray-600">Alias for PaperButton with paper tone.</p>
      <div className="flex flex-wrap gap-4">
        <SketchButton>Default</SketchButton>
        <SketchButton size="sm">Small</SketchButton>
        <SketchButton size="lg"><Search size={16} /> Search</SketchButton>
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">SketchButton — states</h2>
      <div className="flex flex-wrap gap-4">
        <SketchButton disabled>Disabled</SketchButton>
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">SketchButton — with icon</h2>
      <div className="flex flex-wrap gap-4">
        <SketchButton size="lg"><Search size={16} /> Search</SketchButton>
      </div>
    </div>
  ),
}
