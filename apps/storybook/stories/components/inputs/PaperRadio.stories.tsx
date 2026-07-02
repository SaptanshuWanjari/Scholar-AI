import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperRadio, PaperRadioGroup } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperRadio> = {
  title: 'Components/Inputs/PaperRadio',
  component: PaperRadio,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperRadio>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <PaperRadioGroup
        label="Study Mode"
        name="study-mode"
        defaultValue="active"
        options={[
          { value: 'passive', label: 'Passive Reading' },
          { value: 'active', label: 'Active Recall' },
          { value: 'spaced', label: 'Spaced Repetition' },
          { value: 'pomodoro', label: 'Pomodoro (coming soon)', disabled: true },
        ]}
        onChange={val => console.log('mode:', val)}
      />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <PaperRadioGroup
        label="Options"
        name="options"
        defaultValue="opt2"
        options={[
          { value: 'opt1', label: 'Option 1' },
          { value: 'opt2', label: 'Option 2 (default)' },
          { value: 'opt3', label: 'Disabled option', disabled: true },
        ]}
      />
    </div>
  ),
}
