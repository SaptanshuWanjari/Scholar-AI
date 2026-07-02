import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSlider } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperSlider> = {
  title: 'Components/Inputs/PaperSlider',
  component: PaperSlider,
}

export default meta
type Story = StoryObj<typeof PaperSlider>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm">
      <PaperSlider label="Confidence Level" min={0} max={100} defaultValue={60} />
    </div>
  ),
}

export const Range: Story = {
  render: () => {
    const [val, setVal] = useState(40)
    return (
      <div className="p-8 bg-[#f4f1ea] max-w-sm space-y-6">
        <PaperSlider label="Study Duration" min={5} max={120} step={5} value={val} onChange={setVal} showValue />
        <PaperSlider label="Difficulty" min={0} max={10} step={1} defaultValue={7} showValue />
      </div>
    )
  },
}

export const Steps: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm space-y-6">
      <PaperSlider label="Progress" min={0} max={100} value={30} disabled />
      <PaperSlider label="Rating (0-5)" min={0} max={5} step={1} defaultValue={3} showValue />
    </div>
  ),
}
