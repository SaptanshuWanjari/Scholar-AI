import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperInput } from '@paper-ui/components/inputs'
import { Search, User, Lock } from 'lucide-react'

const meta: Meta<typeof PaperInput> = {
  title: 'Components/Inputs/PaperInput',
  component: PaperInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperInput>

export const Playground: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <PaperInput
          label="Email"
          placeholder="ada@example.com"
          value={val}
          onChange={e => setVal(e.target.value)}
          hint="We'll never share your email."
        />
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <PaperInput label="Full Name" placeholder="Ada Lovelace" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-5 bg-[#f4f1ea] max-w-sm">
      <PaperInput label="Full Name" placeholder="Ada Lovelace" icon={<User size={14} />} />
      <PaperInput label="Password" type="password" placeholder="••••••••" icon={<Lock size={14} />} />
      <PaperInput label="Email" type="email" placeholder="ada@example.com" icon={<Search size={14} />} />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-5 bg-[#f4f1ea] max-w-sm">
      <PaperInput label="With error" placeholder="bad input" error="This field is required." />
      <PaperInput label="Disabled" placeholder="Cannot edit" disabled />
      <PaperInput label="Empty" placeholder="Type something…" />
      <PaperInput label="Filled" value="Pre-filled value" onChange={() => {}} />
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-5 bg-[#f4f1ea] max-w-sm">
      <PaperInput
        label="Password"
        type="password"
        placeholder="••••••••"
        icon={<Lock size={14} />}
        hint="At least 8 characters"
      />
      <PaperInput
        label="Search"
        placeholder="Find documents…"
        icon={<Search size={14} />}
      />
    </div>
  ),
}
