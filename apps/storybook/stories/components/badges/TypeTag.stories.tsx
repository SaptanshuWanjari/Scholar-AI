import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TypeTag } from '@paper-ui/components/badges'

const meta: Meta<typeof TypeTag> = {
  title: 'Components/Badges/TypeTag',
  component: TypeTag,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof TypeTag>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">TypeTag</h2>
      <div className="flex flex-wrap gap-3">
        <TypeTag type="pdf" />
        <TypeTag type="md" />
        <TypeTag type="docx" />
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <TypeTag type="pdf" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">TypeTag — file types</h2>
      <div className="flex flex-wrap gap-3">
        <TypeTag type="pdf" />
        <TypeTag type="md" />
        <TypeTag type="docx" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">TypeTag — unknown type</h2>
      <div className="flex flex-wrap gap-3">
        <TypeTag type="unknown" />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">TypeTag — document list</h2>
      <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm">notes</span>
          <TypeTag type="pdf" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">readme</span>
          <TypeTag type="md" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">thesis</span>
          <TypeTag type="docx" />
        </div>
      </div>
    </div>
  ),
}
