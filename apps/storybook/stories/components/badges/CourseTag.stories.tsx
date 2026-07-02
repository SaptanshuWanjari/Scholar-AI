import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CourseTag } from '@paper-ui/components/badges'

const meta: Meta<typeof CourseTag> = {
  title: 'Components/Badges/CourseTag',
  component: CourseTag,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof CourseTag>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">CourseTag, TypeTag, CategoryTag</h2>
      <div className="flex flex-wrap gap-3">
        <CourseTag course="Machine Learning" />
        <CourseTag course="Linear Algebra" tone="sky" />
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <CourseTag course="Machine Learning" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">CourseTag — different courses and tones</h2>
      <div className="flex flex-wrap gap-3">
        <CourseTag course="Machine Learning" />
        <CourseTag course="Linear Algebra" tone="sky" />
        <CourseTag course="Data Structures" tone="sage" />
        <CourseTag course="Operating Systems" tone="lavender" />
        <CourseTag course="Computer Networks" tone="ochre" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">CourseTag — empty</h2>
      <div className="flex flex-wrap gap-3">
        <CourseTag course="" />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">CourseTag — course filter bar</h2>
      <div className="flex flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-lg">
        <CourseTag course="Machine Learning" />
        <CourseTag course="Linear Algebra" tone="sky" />
        <CourseTag course="Data Structures" tone="sage" />
      </div>
    </div>
  ),
}
