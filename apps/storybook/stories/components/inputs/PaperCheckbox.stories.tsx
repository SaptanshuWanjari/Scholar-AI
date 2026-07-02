import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperCheckbox } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperCheckbox> = {
  title: 'Components/Inputs/PaperCheckbox',
  component: PaperCheckbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperCheckbox>

export const Playground: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <PaperCheckbox
          label="Remember me"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
        />
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <PaperCheckbox label="I agree to the terms" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-3 bg-[#f4f1ea]">
      <PaperCheckbox label="Checked" defaultChecked />
      <PaperCheckbox label="Unchecked" />
      <PaperCheckbox label="Disabled" disabled />
      <PaperCheckbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
}
