import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CategoryTag } from '@paper-ui/components/badges'

const meta: Meta<typeof CategoryTag> = {
  title: 'Components/Badges/CategoryTag',
  component: CategoryTag,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof CategoryTag>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">CategoryTag</h2>
      <div className="flex flex-wrap gap-3">
        <CategoryTag category="Science" />
        <CategoryTag category="History" tone="lavender" />
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <CategoryTag category="Science" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">CategoryTag — categories and tones</h2>
      <div className="flex flex-wrap gap-3">
        <CategoryTag category="Science" />
        <CategoryTag category="History" tone="lavender" />
        <CategoryTag category="Math" tone="sky" />
        <CategoryTag category="Literature" tone="sage" />
        <CategoryTag category="Art" tone="ochre" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">CategoryTag — empty</h2>
      <div className="flex flex-wrap gap-3">
        <CategoryTag category="" />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">CategoryTag — filter bar</h2>
      <div className="flex flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-lg">
        <CategoryTag category="Science" />
        <CategoryTag category="Math" tone="sky" />
        <CategoryTag category="Literature" tone="sage" />
      </div>
    </div>
  ),
}
