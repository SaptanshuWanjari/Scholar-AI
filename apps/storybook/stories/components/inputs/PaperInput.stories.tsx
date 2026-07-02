import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperInput } from '@paper-ui/components/inputs'
import { User, Lock } from 'lucide-react'

const meta: Meta<typeof PaperInput> = {
  title: 'Components/Inputs/PaperInput',
  component: PaperInput,
}

export default meta
type Story = StoryObj<typeof PaperInput>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperInput label="Full Name" placeholder="Ada Lovelace" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4 max-w-sm">
      <PaperInput label="Username" placeholder="username" icon={<User size={14} />} />
      <PaperInput label="Password" type="password" placeholder="••••••••" icon={<Lock size={14} />} />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4 max-w-sm">
      <PaperInput label="With error" placeholder="bad input" error="This field is required." />
      <PaperInput label="Disabled" placeholder="Cannot edit" disabled />
      <PaperInput label="With hint" placeholder="Type something…" hint="At least 8 characters" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <div className="p-8 bg-[#f4f1ea] space-y-4 max-w-sm">
        <PaperInput label="Email" placeholder="ada@example.com" value={val} onChange={e => setVal(e.target.value)} />
        <PaperInput label="Filled" value="Pre-filled value" onChange={() => {}} />
      </div>
    )
  },
}
