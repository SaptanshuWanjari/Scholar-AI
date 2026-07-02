import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSheetButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof PaperSheetButton> = {
  title: 'Components/Buttons/PaperSheetButton',
  component: PaperSheetButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperSheetButton>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperSheetButton</h2>
      <div className="flex flex-wrap gap-4">
        <PaperSheetButton>Start Reading</PaperSheetButton>
        <PaperSheetButton>Continue</PaperSheetButton>
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <PaperSheetButton>Start Reading</PaperSheetButton>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperSheetButton — sizes</h2>
      <div className="flex flex-wrap gap-4 items-end">
        <PaperSheetButton>Small</PaperSheetButton>
        <PaperSheetButton>Medium</PaperSheetButton>
        <PaperSheetButton>Large</PaperSheetButton>
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperSheetButton — states</h2>
      <div className="flex flex-wrap gap-4">
        <PaperSheetButton disabled>Disabled</PaperSheetButton>
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperSheetButton — composed</h2>
      <div className="flex flex-wrap gap-4">
        <PaperSheetButton>Start Reading</PaperSheetButton>
        <PaperSheetButton>Continue</PaperSheetButton>
        <PaperSheetButton>Bookmark</PaperSheetButton>
      </div>
    </div>
  ),
}
