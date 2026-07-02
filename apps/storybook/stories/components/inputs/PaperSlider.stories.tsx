import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSlider, PaperLabel } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperSlider> = {
  title: 'Components/Inputs/PaperSlider',
  component: PaperSlider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperSlider>

export const Playground: Story = {
  render: () => {
    const [val, setVal] = useState(40)
    return (
      <div className="p-10 bg-[#f4f1ea] max-w-sm">
        <PaperLabel className="mb-2 block">Study Duration: {val} min</PaperLabel>
        <PaperSlider min={5} max={120} step={5} value={val} onChange={setVal} />
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-sm">
      <PaperLabel className="mb-2 block">Confidence Level</PaperLabel>
      <PaperSlider min={0} max={100} defaultValue={60} />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-sm">
      <PaperLabel className="mb-2 block">Disabled</PaperLabel>
      <PaperSlider min={0} max={100} value={30} disabled />
    </div>
  ),
}
