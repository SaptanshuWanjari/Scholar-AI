import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSelect } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperSelect> = {
  title: 'Components/Inputs/PaperSelect',
  component: PaperSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperSelect>

const options = [
  { value: 'math', label: 'Mathematics' },
  { value: 'cs', label: 'Computer Science' },
  { value: 'physics', label: 'Physics' },
  { value: 'history', label: 'History' },
]

export const Playground: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <div className="p-10 bg-[#f4f1ea] max-w-xs">
        <PaperSelect
          label="Subject"
          value={val}
          onChange={setVal}
          placeholder="Choose a subject…"
          options={options}
        />
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-xs">
      <PaperSelect
        label="Subject"
        placeholder="Choose a subject…"
        options={options}
      />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-4 bg-[#f4f1ea] max-w-xs">
      <PaperSelect
        label="Difficulty"
        defaultValue="medium"
        options={[
          { value: 'easy', label: 'Easy' },
          { value: 'medium', label: 'Medium' },
          { value: 'hard', label: 'Hard' },
        ]}
      />
      <PaperSelect
        label="Disabled"
        disabled
        options={[{ value: 'a', label: 'Option A' }]}
      />
    </div>
  ),
}
