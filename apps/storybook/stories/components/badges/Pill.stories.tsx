import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pill } from '@paper-ui/components/badges'
import { Star } from 'lucide-react'

const meta: Meta<typeof Pill> = {
  title: 'Components/Badges/Pill',
  component: Pill,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof Pill>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">Pill — with dots, icons, and remove</h2>
      <div className="flex flex-wrap gap-3">
        <Pill tone="sage" dot="#3f7a4e">Mastered</Pill>
        <Pill tone="ochre" dot="#b07a2e">Learning</Pill>
        <Pill tone="brick" dot="#a3544a">Weak</Pill>
        <Pill tone="sky" icon={<Star size={10} />}>Starred</Pill>
        <Pill tone="lavender" onRemove={() => {}}>Removable</Pill>
        <Pill tone="ink">Plain</Pill>
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Pill tone="ink">Default Pill</Pill>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">Pill — all tones</h2>
      <div className="flex flex-wrap gap-3">
        <Pill tone="ink">Ink</Pill>
        <Pill tone="sage">Sage</Pill>
        <Pill tone="ochre">Ochre</Pill>
        <Pill tone="sky">Sky</Pill>
        <Pill tone="lavender">Lavender</Pill>
        <Pill tone="brick">Brick</Pill>
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">Pill — with dots</h2>
      <div className="flex flex-wrap gap-3">
        <Pill tone="sage" dot="#3f7a4e">Mastered</Pill>
        <Pill tone="ochre" dot="#b07a2e">Learning</Pill>
        <Pill tone="brick" dot="#a3544a">Weak</Pill>
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">Pill — with dot, icon, remove, plain</h2>
      <div className="flex flex-wrap gap-3">
        <Pill tone="sage" dot="#3f7a4e">Mastered</Pill>
        <Pill tone="ochre" dot="#b07a2e">Learning</Pill>
        <Pill tone="brick" dot="#a3544a">Weak</Pill>
        <Pill tone="sky" icon={<Star size={10} />}>Starred</Pill>
        <Pill tone="lavender" onRemove={() => {}}>Removable</Pill>
        <Pill tone="ink">Plain</Pill>
      </div>
    </div>
  ),
}
