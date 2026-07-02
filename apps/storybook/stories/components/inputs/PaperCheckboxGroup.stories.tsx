import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperCheckboxGroup } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperCheckboxGroup> = {
  title: 'Components/Inputs/PaperCheckboxGroup',
  component: PaperCheckboxGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperCheckboxGroup>

const options = [
  { value: 'ml', label: 'Machine Learning' },
  { value: 'nlp', label: 'NLP' },
  { value: 'cv', label: 'Computer Vision' },
  { value: 'rl', label: 'Reinforcement Learning', disabled: true },
]

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <PaperCheckboxGroup
        label="Topics"
        options={options}
        defaultValue={['ml']}
        onChange={vals => console.log('group:', vals)}
      />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <PaperCheckboxGroup
        label="With default"
        options={[
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B' },
          { value: 'c', label: 'Option C' },
        ]}
        defaultValue={['a', 'c']}
      />
      <PaperCheckboxGroup
        label="With disabled"
        options={[
          { value: 'x', label: 'Available' },
          { value: 'y', label: 'Not Available', disabled: true },
        ]}
      />
    </div>
  ),
}
