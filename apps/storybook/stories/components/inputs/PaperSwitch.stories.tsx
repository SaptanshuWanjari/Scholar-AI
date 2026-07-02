import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSwitch } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperSwitch> = {
  title: 'Components/Inputs/PaperSwitch',
  component: PaperSwitch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperSwitch>

export const Playground: Story = {
  render: () => {
    const [on, setOn] = useState(true)
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <PaperSwitch
          label="Notifications"
          checked={on}
          onChange={e => setOn(e.target.checked)}
        />
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <PaperSwitch label="Dark Mode" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-4 bg-[#f4f1ea]">
      <PaperSwitch label="On" defaultChecked />
      <PaperSwitch label="Off" defaultChecked={false} />
      <PaperSwitch label="Disabled on" checked disabled />
      <PaperSwitch label="Disabled off" checked={false} disabled />
    </div>
  ),
}
