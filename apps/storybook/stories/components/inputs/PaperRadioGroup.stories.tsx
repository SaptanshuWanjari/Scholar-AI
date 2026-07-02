import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperRadioGroup } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperRadioGroup> = {
  title: 'Components/Inputs/PaperRadioGroup',
  component: PaperRadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperRadioGroup>

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

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <PaperRadioGroup
        label="Layout"
        name="layout"
        defaultValue="comfortable"
        options={[
          { value: 'compact', label: 'Compact' },
          { value: 'comfortable', label: 'Comfortable' },
          { value: 'spacious', label: 'Spacious' },
        ]}
      />
      <PaperRadioGroup
        label="Theme"
        name="theme"
        defaultValue="system"
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'System' },
        ]}
      />
    </div>
  ),
}
